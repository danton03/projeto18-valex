import { CardInsertData, CardUpdateData, findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const ENCRYPT_KEY: string = String(process.env.ENCRYPT_KEY);
const cryptr = new Cryptr(ENCRYPT_KEY);

export async function createCardService(requestData: { apiKey: string, employeeId: number, type: TransactionTypes }){
  const { apiKey, employeeId, type } = requestData;

  //verifica se a api-key é válida
  await verifyApiKeyExistence(apiKey);

  //verifica se o empregado está cadastrado e retorna o nome completo se existir
  const employeefullName = await verifyEmployeeRegistration(employeeId);

  //verifica se o funcionário ainda não possui aquele tipo de cartão
  await verifyEmployeeCardConflict(type, employeeId);

  //Cria um número para o cartão com 16 números
  const cardNumber: string = faker.finance.creditCardNumber('################');

  //Cria o nome abreviado para o cartão
  const cardHolderName: string = formatHolderName(employeefullName);

  //Cria a data de expiração do cartão
  const expirationDate = dayjs().add(5, 'year').format("MM/YY");

  //Cria o código CVC do cartão
  const cvc: string = faker.finance.creditCardCVV();
  const encryptedCVC: string = encryptCVC(cvc);

  //Organiza os dados e armazena
  const cardData: CardInsertData = {
    employeeId,
    number: cardNumber,
    cardholderName: cardHolderName,
    securityCode: encryptedCVC,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  //Cria o cartão e recebe o id
  const { id } = await insert(cardData);

  //retorna os dados do cartão cadastrado
  return {
    id,
    number: cardNumber,
    cardholderName: cardHolderName,
    cvc,
    expirationDate,
    type,
  }
}

export async function activateCardService(requestData: { id: number, cvc: string, password: string }){
  const { id, cvc, password } = requestData;

  const card = await verifyCardExistence(id);

  await verifyCardValidity(card.expirationDate);

  if (card.password) {
    throw { 
      code: 'Conflict', 
      message: 'O cartão informado já está ativado.' 
    }
  }

  verifyCVC(cvc, card.securityCode);

  const encryptedPassword = encryptPassword(password);

  await cardRepository.update(id, {password: encryptedPassword});
}

//Funções auxiliares
async function verifyApiKeyExistence(apiKey: string) {
  const apiKeyExists: object = await findByApiKey(apiKey);
  if (!apiKeyExists) {
    throw { 
      code: 'NotFound', 
      message: 'A API key fornecida não pertence a nenhuma empresa.' 
    }
  }
}

async function verifyEmployeeRegistration(employeeId: number) {
  const employeeExists = await findById(employeeId);
  if (!employeeExists) {
    throw { 
      code: 'NotFound', 
      message: 'O usuário informado ainda não é cadastrado em nenhuma empresa.' 
    }
  }
  return employeeExists.fullName;
}

async function verifyEmployeeCardConflict(type: TransactionTypes, employeeId: number) {
  const employeeCardExists: object = await findByTypeAndEmployeeId(type, employeeId);
  //console.log(employeeCardExists);
  if (employeeCardExists) {
    throw { 
      code: 'Conflict', 
      message: `O usuário informado já possui um cartão do tipo ${type}.` 
    }
  }
}

function formatHolderName(employeeFullName: string): string {
  let splitedName: string[] = employeeFullName.toLocaleUpperCase().split(' ').filter((str) => (str.length >= 3))
  const formatedSplitedName = splitedName.map((str, index) => {
    if (index > 0 && index < (splitedName.length-1)) {
      return str[0]; 
    }
    return str;
  });
  const holderName = formatedSplitedName.join(' ');
  return holderName;
}

function encryptCVC(cvc: string): string {
  const encryptedCVC: string = cryptr.encrypt(cvc);
  return encryptedCVC;
}

async function verifyCardExistence(id: number) {
  const card = await cardRepository.findById(id);
  if(!card){
    throw  {
      code: 'NotFound', 
      message: 'Não foi encontrado nenhum cartão com os dados informados'
    }
  }
  return card;
}

async function verifyCardValidity(expirationDate: string) {
  const dateDifference = dayjs(expirationDate).diff(dayjs().format('MM/YY'),'month', true);
  if (dateDifference < 0) {
    throw  {
      code: 'Expired', 
      message: 'Não é possível ativar um cartão com a validade expirada.'
    }
  }
  return false;
}

function verifyCVC(cvc: string, encryptedCVC: string) {
  const decryptedCVC: string = cryptr.decrypt(encryptedCVC);
  if (!(cvc === decryptedCVC)) {
    throw  {
      code: 'BadRequest', 
      message: 'O CVC informado está incorreto.'
    }
  }
  return false;
}

function encryptPassword(password: string) {
  const SALT = 12;
  const encryptedPassword = bcrypt.hashSync(password, SALT);
  return encryptedPassword;
}
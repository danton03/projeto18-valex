import { CardInsertData, findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import * as businessRepository from "../repositories/businessRepository";
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

  const operation = "ativar";
  await verifyCardValidity(card.expirationDate, operation);

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

export async function generateBalanceService(id: number){
  const card = await verifyCardExistence(id);
  const transactions = await paymentRepository.findByCardId(card.id);
  const recharges = await rechargeRepository.findByCardId(card.id);
  const balance = calculateBalance(transactions, recharges);

  return {
    balance, 
    transactions, 
    recharges
  }
}

export async function  blockCardService(id: number, password: string){
  //Verifica se o cartão é cadastrado
  const card = await verifyCardExistence(id);
  //Verifica se o cartão não expirou
  const operation = "bloquear";
  await verifyCardValidity(card.expirationDate, operation);
  //Verifica se o cartão não está bloqueado
  verifyIfBlocked(card.isBlocked);
  //Verifica se a senha está correta
  authenticatePassword(password, card.password);
  //Bloqueia o cartão
  await cardRepository.update(id, {isBlocked: true});
}

export async function  unblockCardService(id: number, password: string){
  //Verifica se o catrão é cadastrado
  const card = await verifyCardExistence(id);
  //Verifica se o cartão não expirou
  const operation = "desbloquear";
  await verifyCardValidity(card.expirationDate, operation);
  //Verifica se o cartão não está bloqueado
  verifyIfUnblocked(card.isBlocked);
  //Verifica se a senha está correta
  authenticatePassword(password, card.password);
  //Bloqueia o cartão
  await cardRepository.update(id, {isBlocked: false});
}

export async function  rechargeCardService(id: number, amount: number, apiKey: string){
  //verifica se a api-key é válida
  await verifyApiKeyExistence(apiKey);
  //Verifica se o cartão é cadastrado
  const card = await verifyCardExistence(id);
  //Verifica se o cartão está ativo
  verifyIfCardIsActive(card.password);
  //Verifica se o cartão não expirou
  const operation = "recarregar";
  await verifyCardValidity(card.expirationDate, operation);
  //Recarrega o cartão
  await rechargeRepository.insert({cardId: card.id, amount})
}

export async function  paymentService(paymentData: { 
  cardId: number, password: string, businessId: number, amount: number 
}){
  const { cardId, password, businessId, amount } = paymentData;
  //Verifica se o cartão é cadastrado
  const card = await verifyCardExistence(cardId);
  //Verifica se o cartão está ativo
  verifyIfCardIsActive(card.password);
  //Verifica se o cartão não expirou
  const operation = "utilizar";
  await verifyCardValidity(card.expirationDate, operation);
  //Verifica se o cartão não está bloqueado
  if (card.isBlocked) {
    throw { 
      code: 'Unauthorized', 
      message: 'O cartão informado está bloqueado.' 
    }
  }
  //Verifica se a senha está correta
  authenticatePassword(password, card.password);
  //Verifica se o estabelecimento existe
  await validateBusiness(businessId, card.type);
  //verifica se o saldo é suficiente para a compra
  await validateBalance(card.id, amount);
  //Finaliza a compra
  await paymentRepository.insert({cardId: card.id, businessId, amount});
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

async function verifyCardValidity(expirationDate: string, operation: string) {
  const dateDifference = dayjs(expirationDate).diff(dayjs().format('MM/YY'),'month', true);
  if (dateDifference < 0) {
    throw  {
      code: 'Expired', 
      message: `Não é possível ${operation} um cartão com a validade expirada.`
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

function calculateBalance(transactions: any, recharges: any) {
  let transactionsValue: number = 0;
  let rechargesValue: number = 0;

  for (const transaction of transactions) {
    transactionsValue += transaction.amount;
  }

  for (const recharge of recharges) {
    rechargesValue += recharge.amount;
  }

  const balance = rechargesValue - transactionsValue;
  return balance;
}

function verifyIfBlocked(isBlocked: boolean) {
  if (isBlocked) {
    throw { 
      code: 'Conflict', 
      message: 'O cartão informado já está bloqueado.' 
    }
  }
}

function verifyIfUnblocked(isBlocked: boolean) {
  if (!isBlocked) {
    throw { 
      code: 'Conflict', 
      message: 'O cartão informado já está desbloqueado.' 
    }
  }
}

function authenticatePassword(password: string, encryptedPassword: string) {
  const comparePassword = bcrypt.compareSync(password, encryptedPassword);
  if(!comparePassword){
    throw { 
      code: 'Unauthorized', 
      message: 'Credencial inválida.' 
    }
  }
}

function verifyIfCardIsActive(password: string) {
  if (!password) {
    throw { 
      code: 'BadRequest', 
      message: 'O cartão informado ainda não foi ativado.' 
    }
  }
}

async function validateBusiness(id: number, cardType: string) {
  const business = await businessRepository.findById(id);

  if(!business){
    throw  {
      code: 'NotFound', 
      message: 'Não foi encontrado nenhum estabelecimento com os dados informados'
    }
  }

  else if(business.type !== cardType){
    throw  {
      code: 'BadRequest', 
      message: `O estabelecimento não aceita cartões do tipo ${cardType}`
    }
  }

  return business;
}

async function validateBalance(cardId: number, amount: number) {
  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const balance = calculateBalance(transactions, recharges);

  if(balance < amount){
    throw  {
      code: 'Unauthorized', 
      message: 'Saldo insuficiente.'
    }
  }
}
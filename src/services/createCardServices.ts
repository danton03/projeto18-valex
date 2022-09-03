import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";

export async function storeCard(cardData: { apiKey: string, employeeId: number, type: string }) {
  const { apiKey, employeeId, type } = cardData;

  //verifica se a api-key é válida
  await verifyApiKeyExistence(apiKey);

  //verifica se o empregado está cadastrado
  await verifyEmployeeRegistration(employeeId);
}

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
  const employeeExists: object = await findById(employeeId);
  console.log(employeeExists);
  if (!employeeExists) {
    throw { 
      code: 'NotFound', 
      message: 'O usuário informado ainda não é cadastrado em nenhuma empresa.' 
    }
  }
}
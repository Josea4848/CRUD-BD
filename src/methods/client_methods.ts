import { Repository } from "typeorm";
import { Client } from "../entity/Client";

export async function addClient(CPF: string, first_name: string, last_name: string, birthdate: Date, client_table: Repository<Client>): Promise<Client>{
  if (isCPFValid(CPF)) {
    const client = new Client(CPF, first_name, last_name, birthdate);
    await client_table.save(client);
    return client;
  }
  return;
}

export async function getAllClients(client_table: Repository<Client>): Promise<Client[]>{
  return await client_table.find()
}

export async function getClient(CPF: string, client_table: Repository<Client>): Promise<Client[]>{
  return await client_table.findBy({CPF: CPF})
}

export async function removeClient(CPF: string, client_table: Repository<Client>): Promise<void>{
  const client = await getClient(CPF, client_table);
  await client_table.remove(client)
}

function isCPFValid(CPF: string): boolean{
  if(CPF.length != 11){
    throw new Error("CPF is wrong");
    return false;
  }

  if(!(/^\d{11}$/.test(CPF))){
    throw new Error("CPF is wrong");
    return false;
  };
  return true;
}

import { Repository } from "typeorm";
import { Client } from "../entity/Client";

export async function addClient(CPF: string, first_name: string, last_name: string, birthdate: Date, client_table: Repository<Client>): Promise<Client>{

  const client = new Client(CPF, first_name, last_name, birthdate);

  await client_table.save(client);

  return client;
}

export async function getClients(client_table: Repository<Client>): Promise<Client[]>{
  return await client_table.find()
}

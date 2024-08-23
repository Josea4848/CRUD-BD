import { Repository } from "typeorm";
import { Client } from "../entity/Client";

//----------------------------------------- CREATE ---------------------------------------------
export async function addClient(
  CPF: string,
  first_name: string,
  last_name: string,
  birthdate: string,
  client_table: Repository<Client>
): Promise<Client> {
  if (isCPFValid(CPF)) {
    const client = new Client(CPF, first_name, last_name, birthdate);
    await client_table.save(client);
    return client;
  }
  return;
}

//------------------------------------------ READ ---------------------------------------------
export async function getAllClients(
  client_table: Repository<Client>
): Promise<Client[]> {
  return await client_table.find();
}

export async function getClient(
  CPF: string,
  client_table: Repository<Client>
): Promise<Client> {
  if (isCPFValid(CPF)) {
    return await client_table.findOneBy({ CPF: CPF });
  }
  return;
}

export async function getClientByName(
  first_name: string,
  last_name: string,
  client_table: Repository<Client>
): Promise<Client[]> {
  if (first_name == null) {
    return await client_table.findBy({ last_name: last_name });
  } else if (last_name == null) {
    return await client_table.findBy({ first_name: first_name });
  } else {
    const clients = await client_table.findBy({
      first_name: first_name,
      last_name: last_name,
    });
    if (clients == null) {
      return await client_table.findBy({ first_name: first_name });
    } else {
      return clients;
    }
  }
}

//--------------------------------------- UPDATE ---------------------------------------------
export async function updateClientName(
  CPF: string,
  new_first_name: string,
  new_last_name: string,
  client_table: Repository<Client>
): Promise<void> {
  if (new_first_name == null) {
    await client_table.update(CPF, { last_name: new_last_name });
  } else if (new_last_name == null) {
    await client_table.update(CPF, { first_name: new_first_name });
  } else {
    await client_table.update(CPF, {
      first_name: new_first_name,
      last_name: new_last_name,
    });
  }
}

export async function updateClientBirthdate(
  CPF: string,
  date: string,
  client_table: Repository<Client>
): Promise<void> {
  if (isCPFValid(CPF)) {
    await client_table.update(CPF, { birthdate: date });
  }
}

//--------------------------------------- DELETE ---------------------------------------------
export async function removeClient(
  client: Client,
  client_table: Repository<Client>
): Promise<void> {
  await client_table.remove(client);
}

export async function removeClientCPF(
  CPF: string,
  client_table: Repository<Client>
): Promise<void> {
  if (isCPFValid(CPF)) {
    const client = await getClient(CPF, client_table);
    await client_table.remove(client);
  }
}

//--------------------------------------- checks --------------------------------------------
function isCPFValid(CPF: string): boolean {
  if (CPF.length != 11) {
    throw new Error("Not a valid CPF");
    return false;
  }

  if (!/^\d{11}$/.test(CPF)) {
    throw new Error("Not a valid CPF");
    return false;
  }
  return true;
}

import { Repository } from "typeorm";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";

const carBrands = [
  "Toyota",
  "Ford",
  "Honda",
  "Chevrolet",
  "BMW",
  "Mercedes",
  "Mahindra",
  "Ferrari",
];
const carModels = [
  "Corolla",
  "Mustang",
  "Civic",
  "Impala",
  "Z4",
  "AMG",
  "Bolero",
  "F40",
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create and save a random car
function generateRandomCar(): Car {
  const year = getRandomInt(1960, new Date().getFullYear()); // Random year between 1990 and the current year
  const random = getRandomInt(0, carModels.length - 1);
  const model = carModels[random];
  const brand = carBrands[random];
  const km = getRandomInt(0, 300000);

  return new Car(year, model, brand, km);
}

const firstNames = ["John", "Jane", "Alice", "Bob", "Michael", "Sarah"];
const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis"];

// Function to generate a random CPF (11 digits)
function generateRandomCPF(): string {
  return Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

// Function to generate a random birthdate (between 1950 and 2005)
function generateRandomBirthdate(): string {
  const start = new Date(1960, 0, 1);
  const end = new Date(2024, 0, 1);
  const birthdate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return birthdate.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
}

// Function to create and save a random client
function generateRandomClient(): Client {
  const CPF = generateRandomCPF();
  const first_name = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last_name = lastNames[Math.floor(Math.random() * lastNames.length)];
  const birthdate = generateRandomBirthdate();

  return new Client(CPF, first_name, last_name, birthdate);
}

function generateRandomSale(cars: Car[], clients: Client[]): Sale {
    const randomCar = cars[getRandomInt(0, cars.length - 1)];
    const randomClient = clients[getRandomInt(0, clients.length - 1)];
    const randomPrice = parseFloat((Math.random() * 100000).toFixed(2));

    return new Sale(randomCar.id, randomClient, randomCar, randomPrice);
}

export async function populateDB(qtd: number, car_table: Repository<Car>, client_table: Repository<Client>, sale_table: Repository<Sale>): Promise<void>{

  var cars: Car[] = [];
  var clients: Client[] = [];

  for (var i = 0; i < qtd*2; i++){
    const car: Car = generateRandomCar();
    await car_table.save(car);

    const client: Client = generateRandomClient();
    await client_table.save(client);

    cars.push(car);
    clients.push(client);
  }

  for (var j = 0; j < qtd; j++){
    const sale: Sale = generateRandomSale(cars, clients);
    await sale_table.save(sale);
  }




}

import { Repository } from "typeorm";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
import { Seller } from "./entity/seller";
import { Manager } from "./methods/manager";

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
  const is_flamengo = Boolean(Math.round(Math.random()));

  return new Client(CPF, first_name, last_name, birthdate, is_flamengo);
}

// Modify generateRandomSale to include a seller
function generateRandomSale(
  cars: Car[],
  clients: Client[],
  sellers: Seller[]
): Sale {
  const randomCar = cars[getRandomInt(0, cars.length - 1)];
  const randomClient = clients[getRandomInt(0, clients.length - 1)];
  const randomSeller = sellers[getRandomInt(0, sellers.length - 1)];
  const randomPrice = parseFloat((Math.random() * 100000).toFixed(2));

  return new Sale(
    randomCar.id,
    randomSeller,
    randomClient,
    randomCar,
    randomPrice
  ); // Add seller to the Sale
}

// Modify populateDB to handle sellers
export async function populateDB(
  qtd: number,
  car_table: Repository<Car>,
  client_table: Repository<Client>,
  seller_table: Repository<Seller>, // Add seller table repository
  sale_table: Repository<Sale>,
  db: Manager
): Promise<void> {
  var cars: Car[] = [];
  var clients: Client[] = [];

  for (var i = 0; i < qtd * 2; i++) {
    const car: Car = generateRandomCar();
    await db.car.add(car.year, car.model, car.brand, car.km, car_table);
    const client: Client = generateRandomClient();
    await db.client.add(
      client.CPF,
      client.first_name,
      client.last_name,
      client.birthdate,
      client.is_flamengo,
      client_table
    );

    cars.push(car);
    clients.push(client);
  }

  cars = await db.car.getAll(car_table);
  clients = await db.client.getAll(client_table);
  const sellers = await db.seller.getAll(seller_table); // Get all sellers

  for (var j = 0; j < qtd; j++) {
    const sale: Sale = generateRandomSale(cars, clients, sellers); // Include sellers in the sale generation
    await db.sale.addOne(
      sale.seller,
      sale.client,
      sale.car,
      sale.price,
      car_table,
      sale_table
    ); // Save sale with seller
  }
}

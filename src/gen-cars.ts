import { Car } from "./entity/Car";
import { Client } from "./entity/Client";

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
  const year = getRandomInt(1990, new Date().getFullYear()); // Random year between 1990 and the current year
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
  const start = new Date(1950, 0, 1);
  const end = new Date(2005, 0, 1);
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

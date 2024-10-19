const cars_list = document.querySelector("#cars_list");
const create_forms = document.querySelector("#create-car");
const car_input = document.querySelector("#car-input-model");

//------------------ Cars API Begin ------------------------------
//get cars
const getCars = () => {
  fetch("http://localhost:8080/cars/all", { method: "GET" })
    .then((response) => {
      //request error
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }
      //request ok
      return response.json();
    })
    .then((data) => {
      addCars(data);
    })
    .catch((error) => {
      console.error(`Fetch problem: ${error.message}`);
    });
};
//------------------ Cars API End ------------------------------

//------------------ Components ---------------------------
const addCars = (cars) => {
  removeCars();

  cars.forEach((car) => {
    const li = document.createElement("li");
    li.className = "car-row";
    li.textContent = `${capitalize(car.brand)} ${capitalize(car.model)} | ${
      car.km
    }km | ${car.year} | ${car.sold ? "Vendido" : "À venda"}`;
    cars_list.appendChild(li);
  });
};

const removeCars = () => {
  document.querySelectorAll(".car-row").forEach((item) => {
    item.remove();
  });
};

create_forms.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(create_forms); // Coleta os dados do formulário

  console.log(formData);

  await fetch("http://localhost:8080/cars", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ERROR ${response.status}`);
      return response.json();
    })
    .then((data) => {
      alert("Carro cadastrado!");
      getCars();
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
});

//------------------ Components END -------------------------------

//------------------ String function ----------------------------
export function capitalize(str) {
  if (!str) return str; // Verifica se a string não é vazia
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

car_input.addEventListener("input", (e) => {
  fetch(`http://localhost:8080/cars/filter/?model=${e.target.value}`, {
    method: "GET",
  })
    .then((response) => {
      //request error
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }
      //request ok
      return response.json();
    })
    .then((data) => {
      addCars(data);
    })
    .catch((error) => {
      console.error(`Fetch problem: ${error.message}`);
    });
});

getCars();

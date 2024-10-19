// Obtém o valor armazenado
const cpf_seller = localStorage.getItem("user");
const cars_blk = document.querySelector("#cars_block");
const cars_list = document.querySelector("#cars_list");
const client_error = document.querySelector(".msg-error");
let carsObj_list = [];

//get cars
fetch("http://localhost:8080/cars", { method: "GET" })
  .then((response) => {
    //request error
    if (!response.ok) {
      throw new Error(`HTTP ERROR: ${response.status}`);
    }
    //request ok
    return response.json();
  })
  .then((data) => {
    carsObj_list = data;
    addCars(carsObj_list);
  })
  .catch((error) => {
    console.error(`Fetch problem: ${error.message}`);
  });

//add cars
const addCars = (data) => {
  data.forEach((car) => {
    //só exibe carros não vendidos
    if (!car.sold) {
      const li = document.createElement("li");
      li.className = "car-row";
      li.textContent = `${car.brand} ${car.model} | ${car.km}km | ${car.year}`;

      //click to sell
      const sale_btn = document.createElement("button");
      sale_btn.textContent = "Vender";
      sale_btn.onclick = () => sellCar(car.id, li);
      li.appendChild(sale_btn);
      cars_list.appendChild(li);
    }
  });
};

//sellCar
const sellCar = async (car_id, item) => {
  const cpf = document.querySelector("#cpf").value;
  const client_status = await verifyClient(cpf);
  const price = document.querySelector("#price").value;

  if (isNaN(price) || price == "") {
    alert("Preço deve ser um valor numérico");
  }

  //se o CPF do cliente for válido (registrado)
  else if (client_status) {
    clientError("hidden");
    const data = {
      cpf_seller: cpf_seller,
      cpf: cpf,
      car_id: car_id,
      price: price,
    };
    //INSERT INTO SALE AND UPDATE CARS
    await fetch("http://localhost:8080/sales", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP STATUS: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("Resposta do servidor:", data);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });

    cars_list.removeChild(item);
  }
  //cpf inválido
  else {
    clientError("visible");
  }
};

//verify client by cpf
const verifyClient = async (cpf) => {
  cpf = cpf.replace(/-|\./gi, "");
  const regex = /\D/; //regex para verificar sem cpf possui algum caractere não numérico
  let is_client = true;

  //Verificação do cpf
  if (cpf.length != 11 || regex.test(cpf)) {
    return false;
  }

  await fetch(`http://localhost:8080/clients/${cpf}`)
    .then((response) => {
      //resquest error
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }
      return response.json();
    })
    .then((client_status) => {
      is_client = client_status.isClient;
    })
    .catch((error) => {
      console.error(`HTTP ERROR: ${error.message}`);
    });

  return is_client;
};

//mostrar ou não a mensagem de erro
function clientError(visibility) {
  client_error.style.visibility = visibility;
}

//http://localhost:8080/cars/filter/?model=

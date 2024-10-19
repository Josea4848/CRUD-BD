async function getSales() {
  const cpf = document.getElementById("cpf").value;
  document.getElementById("msg-error").style.visibility = "hidden";

  if (await verifyClient(cpf)) {
    await fetch(`http://localhost:8080/sales/${cpf}`, {
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
        addSales(data);
      })
      .catch((error) => {
        console.error(`Fetch problem: ${error.message}`);
      });
  } else {
    document.getElementById("msg-error").style.visibility = "visible";
  }
}

//verify client by cpf
const verifyClient = async (cpf) => {
  cpf = cpf.replace(/-|\./gi, "");
  const regex = /\D/; //regex para verificar se o cpf possui algum caractere não numérico
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

function addSales(sales) {
  const sales_block = document.querySelector("#sales-list");
  const qtd_sales = document.querySelector("#sales");
  const value_sales = document.querySelector("#value");
  let value = 0;

  sales_block.textContent = "";

  //Exibir quantidade de vendas
  qtd_sales.textContent = `Quantidade de compras: ${sales.length}`;

  sales.forEach((sale) => {
    console.log(sale);

    value += Number(sale.price);

    let li = document.createElement("li");

    //ID DA VENDA
    let id = document.createElement("p");
    id.textContent = `ID: ${sale.id}`;
    li.appendChild(id);

    //NAME
    let name = document.createElement("p");
    name.textContent = `Nome do comprador: ${sale.client.first_name} ${sale.client.last_name}`;
    li.appendChild(name);

    //CPF
    let cpf = document.createElement("p");
    cpf.textContent = `CPF comprador: ${sale.client.CPF}`;
    li.appendChild(cpf);

    //Price
    let price = document.createElement("p");
    price.textContent = `Valor: R$${sale.price}`;
    li.appendChild(price);

    //Modelo do carro
    let car = document.createElement("p");
    car.textContent = `Veículo: ${sale.car.brand} ${sale.car.model}`;
    li.appendChild(car);

    sales_block.appendChild(li);
  });

  value_sales.textContent = `Valor total: R$${value}`;
}

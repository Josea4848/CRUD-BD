//--------------- Sales API BEGIN -----------------
const getSales = async () => {
  await fetch("http://localhost:8080/sales")
    .then((response) => {
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log(JSON.stringify(data));
      showSales(data);
    })
    .catch((error) => {
      return console.error(error.message);
    });
};
//--------------- Sales API END -----------------

// ------------- Components ------------------
const car_input = document.querySelector("#car-search");

function showSales(sales) {
  const sales_block = document.querySelector("#sales-list");
  const qtd_sales = document.querySelector("#sales");
  const value_sales = document.querySelector("#value");
  let value = 0;

  //Exibir quantidade de vendas
  qtd_sales.textContent += ` ${sales.length}`;

  sales.forEach((sale) => {
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

  value_sales.textContent += value.toFixed(2);
}

getSales();

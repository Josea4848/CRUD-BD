const users_blk = document.querySelector("#users-list");
const delete_icon_path = "../icons/delete.svg";
const client_error = document.querySelector(".msg-error");

//------------ Register section and button ----------
const register_btn = document.querySelector("#create-btn");
const form_create = document.querySelector("form");
const register_section = document.querySelector("#create_user");

// ----------- Update section and button
const update_section = document.querySelector("#update_user");
const update_btn = document.querySelector("#update-btn");
const update_params = document.querySelector("#param");
const nameUpdate = document.querySelector("#form-name");

// ----------- filter BEGIN ----------------------
const first_name_input = document.querySelector("#f-name-search");
const last_name_input = document.querySelector("#l-name-search");

const inputs = [first_name_input, last_name_input];

// ---------- filter END --------------------------
let users = []; //clients array

let p = document.querySelector("#show-number");
let counter;

update_params.addEventListener("change", () => {
  clientError("hidden");
});

//update client button
update_btn.onclick = () => {
  const send_update_btn = document.querySelector("#send_btn_updt");
  send_update_btn.style.display = "none";
  update_params.value = "";
  register_section.style.visibility = "hidden";
  //get update section visibility state and hidden or visibility
  if (window.getComputedStyle(update_section).visibility == "hidden")
    update_section.style.visibility = "visible";
  else {
    update_section.style.visibility = "hidden";
    UpdateButton("disable");
    disableFormsUpd();
  }
};

//register client button
register_btn.onclick = () => {
  update_section.style.visibility = "hidden"; //if update section is visible
  //get create section visibility state and hidden or visibility
  if (window.getComputedStyle(register_section).visibility == "hidden")
    register_section.style.visibility = "visible";
  else register_section.style.visibility = "hidden";
};

/* ---------------------- Clients BEGIN ---------------------- */

//Add client
register_section.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const jsonData = Object.fromEntries(formData); // Converte para JSON
  const isFlamengoChecked = document.getElementById("is_flamengo").checked;
  jsonData.is_flamengo = isFlamengoChecked ? "true" : "false";

  let cpf = formData.get("CPF").trim();

  console.log(jsonData);

  //Verificação do cpf
  if (verifyCPF(cpf) && !(await isClientReq(cpf))) {
    await fetch("http://localhost:8080/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indica que estamos enviando JSON
      },
      body: JSON.stringify(jsonData), // Converte o objeto para uma string JSON
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ERROR ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("Resposta do servidor:", data);
        alert("Cliente cadastrado!");
        getClients();
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  } else {
    alert("CPF inválido ou cliente já cadastrado");
  }
});

//fetch data from server
const getClients = async () => {
  fetch(
    `http://localhost:8080/clients/name/filter/?first_name=${first_name_input.value}&last_name=${last_name_input.value}`
  )
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      users = data;
      addClients(data);
    })
    .catch((error) => {
      console.error(`HTTP ERROR: ${error}`);
    });
};

//create clients html
const addClients = async (users) => {
  deleteClienthtml();
  counter = 0;

  users.forEach((user) => {
    counter++;
    const li = document.createElement("li");
    const del_btn = document.createElement("button");
    del_btn.className = "del-btn";
    del_btn.textContent = "Deletar";

    del_btn.onclick = () => {
      deleteClient(user.CPF, li);
    };

    li.className = "client-row";
    li.textContent = `${user.first_name} ${user.last_name} | ${user.CPF} | ${
      user.birthdate
    }  ${user.is_flamengo ? " | Flamenguista" : ""}`;
    li.appendChild(del_btn);
    users_blk.appendChild(li);
  });

  p.textContent = `Quantidade de clientes cadastrados: ${counter}`;
};

//delete clients html
const deleteClienthtml = () => {
  document.querySelectorAll(".client-row").forEach((item) => {
    item.remove();
    counter = 0;
  });
};

//delete user
const deleteClient = async (cpf, item) => {
  await fetch(`http://localhost:8080/clients/${cpf}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);

      users_blk.removeChild(item);
      counter--;
      p.textContent = `Quantidade de clientes cadastrados: ${counter}`;
    })
    .catch((error) => {
      console.error(error.status);
    });
};

//return if client is registered
const isClient = (cpf) => {
  fetch(`http://localhost:8080/clients/${cpf}`)
    .then((response) => {
      //resquest error
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }
      return response.json();
    })
    .then((client_status) => {
      return client_status;
    })
    .catch((error) => {
      console.error(`HTTP ERROR: ${error.message}`);
    });
};

//it verify if is client
export const isClientReq = async (cpf) => {
  let is_client = false;

  if (verifyCPF(cpf)) {
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
  }

  return is_client;
};

nameUpdate.addEventListener("submit", async (event) => {
  event.preventDefault(); // Previne o envio padrão do formulário

  const formData = new FormData(nameUpdate); // Coleta os dados do formulário
  const jsonData = Object.fromEntries(formData); // Converte para JSON

  let cpf = jsonData.CPF.trim();
  clientError("hidden");
  if (verifyCPF(cpf) && (await isClientReq(cpf))) {
    await fetch(`http://localhost:8080/clients/name/${jsonData.CPF}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP ERROR: ", response.status);
        alert("Cliente atualizado com sucesso!");
        getClients();
      })
      .catch((error) => {
        console.error("ERROR ", error);
      });
  } else {
    //not registered client or invalid id
    clientError("visible");
  }
});

const dateUpdate = document.querySelector("#form-date");
dateUpdate.addEventListener("submit", async (event) => {
  event.preventDefault(); // Previne o envio padrão do formulário
  const formData = new FormData(dateUpdate); // Coleta os dados do formulário
  const jsonData = Object.fromEntries(formData); // Converte para JSON
  clientError("hidden");
  if (verifyCPF(jsonData.CPF) && (await isClientReq(jsonData.CPF))) {
    await fetch(`http://localhost:8080/clients/date/${jsonData.CPF}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP ERROR: ", response.status);
        getClients();
        console.log(response.statusText);
      })
      .catch((error) => {
        console.error("ERROR ", error);
      });
  } else {
    //not registered client or invalid id
    clientError("visible");
  }
});

//---------------- Clients END ------------------------------

update_params.addEventListener("change", (event) => {
  createUpdateSection(event);
});

const createUpdateSection = (event) => {
  let param_value = event.target.value;
  disableFormsUpd();

  if (param_value != "") {
    UpdateButton("enable");
    document.querySelector(`#form-${param_value}`).style.display = "block";
  } else {
    UpdateButton("disable");
  }
};

function disableFormsUpd() {
  let forms = document.querySelectorAll(".form-update");

  forms.forEach((form) => {
    form.style.display = "none";
  });
}

function UpdateButton(state) {
  let btn = document.querySelector("#send_btn_updt");

  if (state == "disable") {
    btn.style.display = "none";
  } else if (state == "enable") {
    btn.style.display = "block";
  }
}

//check if cpf is valid
export const verifyCPF = (cpf) => {
  cpf = cpf.replace(/-|\./gi, "");
  const regex = /\D/; //regex para verificar sem cpf possui algum caractere não numérico

  let isValid = cpf.length == 11 && !regex.test(cpf);

  console.log(`ERROR ${isValid}`);

  return isValid;
};

//mostrar ou não a mensagem de erro
function clientError(visibility) {
  client_error.style.visibility = visibility;
}

//get clients
getClients();

inputs.forEach((input) => {
  input.addEventListener("input", getClients);
});

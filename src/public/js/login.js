// Verifica se há um usuário logado no localStorage ao carregar a página
window.onload = function () {
  const loggedUser = localStorage.getItem("user");
  if (loggedUser) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("menu").style.display = "flex";
    document.getElementById("user-info").style.display = "flex";
  } else {
    showLogin();
  }
};

// Função para exibir o formulário de login
function showLogin() {
  document.getElementById("login-container").style.display = "flex";
}

// Função para exibir as informações do usuário logado
function showUserInfo(username) {
  document.getElementById("user-name").textContent = username;
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("user-info").classList.remove("hidden");
}
document.getElementById("user-info").classList.remove("hidden");
// Função para efetuar o login
async function login() {
  const cpf = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (cpf && password) {
    try {
      console.log(JSON.stringify({ cpf, password }));

      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazena o CPF do usuário no localStorage e exibe as informações
        localStorage.setItem("user", cpf);
        document.getElementById("login-container").style.display = "none";
        document.getElementById("menu").style.display = "flex";
        document.getElementById("user-info").style.display = "flex";
      } else {
        alert(data.message || "Erro no login. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao se conectar ao servidor.");
    }
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}

// Função para sair e limpar o localStorage
function logout() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("user-info").style.display = "none";

  localStorage.removeItem("user");
  showLogin();
}

document.getElementById("user-info").addEventListener("click", logout);
document.getElementById("menu").style.display = "none";
document.getElementById("user-info").style.display = "none";

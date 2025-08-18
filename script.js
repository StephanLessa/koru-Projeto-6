const perguntaInput = document.getElementById("pergunta");
const contadorCaracteres = document.getElementById("contador-caracteres");
const limiteCaracteres = 500;

perguntaInput.addEventListener("input", () => {
  const caracteresDigitados = perguntaInput.value.length;
  contadorCaracteres.textContent = `${caracteresDigitados} / ${limiteCaracteres}`;

  if (caracteresDigitados > limiteCaracteres) {
    contadorCaracteres.style.color = "red";
  } else {
    contadorCaracteres.style.color = "#999999";
  }
});

const chatBox = document.getElementById("chat-box");
chatBox.style.height = "400px";
chatBox.style.overflowY = "scroll";

// Notificações
function mostrarNotificacao(mensagem, duracao = 3000) {
  const container = document.getElementById("notificacao-container");
  const notif = document.createElement("div");
  notif.className = "notificacao";
  notif.textContent = mensagem;
  container.appendChild(notif);

  // animação de entrada
  setTimeout(() => notif.classList.add("show"), 10);

  // remove após o tempo
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => container.removeChild(notif), 300);
  }, duracao);
}
// Evento de clique no botão Enviar
document.getElementById("enviarBtn").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value;
  const pergunta = document.getElementById("pergunta").value;
  const respostaContainer = document.getElementById("resposta-container");
  const respostaTexto = document.getElementById("resposta");
  const contador = document.getElementById("contador-caracteres");

  if (!apiKey || !pergunta) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  console.log("Chave da API:", apiKey);
  console.log("Pergunta:", pergunta);

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: pergunta }],
      }),
    });

    const data = await resposta.json();
    respostaTexto.innerHTML = marked.parse(data.choices[0].message.content);

    respostaContainer.style.display = "block";
  } catch (error) {
    respostaTexto.textContent = "Ocorreu um erro ao se comunicar com a IA.";
    respostaContainer.style.display = "block";
  }
});

// Botão Limpar Resposta
document.getElementById("limparBtn").addEventListener("click", () => {
  if (confirm("Deseja realmente limpar a resposta?")) {
    document.getElementById("resposta").textContent = "";
    document.getElementById("pergunta").value = "";
    document.getElementById("resposta-container").classList.add("hidden");
    mostrarNotificacao("Resposta e pergunta limpas.");
  }
});

// Botão Copiar Resposta
document.getElementById("copiarBtn").addEventListener("click", async () => {
  const resposta = document.getElementById("resposta").innerText;

  if (!resposta.trim()) {
    mostrarNotificacao("Não há resposta para copiar.");
    return;
  }
  if (!navigator.clipboard) {
    mostrarNotificacao(
      "Funcionalidade de copiar não disponível neste navegador."
    );
    return;
  }
  try {
    await navigator.clipboard.writeText(resposta);
    mostrarNotificacao("Resposta copiada com sucesso! ✅");
  } catch (err) {
    console.error("Erro ao copiar:", err);
    mostrarNotificacao("Não foi possível copiar a resposta.");
  }
});

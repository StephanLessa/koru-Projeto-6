document.getElementById("enviarBtn").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value;
  const pergunta = document.getElementById("pergunta").value;
  const respostaContainer = document.getElementById("resposta-container");
  const respostaTexto = document.getElementById("resposta");

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
        model: "gpt-3.5-turbo",
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

document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const perguntaInput = document.getElementById("pergunta");
  const enviarBtn = document.getElementById("enviarBtn");
  const respostaContainer = document.getElementById("resposta-container");

 
  adicionarMensagemIa("Olá! Cole sua chave da API e faça uma pergunta.");

 
  enviarBtn.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value;
    const pergunta = perguntaInput.value;

    
    if (!apiKey || !pergunta) {
      adicionarMensagemIa(
        "Por favor, preencha a chave da API e a sua pergunta."
      );
      return;
    }

    
    adicionarMensagemUsuario(pergunta);

    
    perguntaInput.value = "";

    
    const mensagemCarregamento = adicionarMensagemIa("Gerando resposta...");

    
    const chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: pergunta }] });
    const payload = { contents: chatHistory };

    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      
      respostaContainer.removeChild(mensagemCarregamento);

      
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        adicionarMensagemIa(text);
      } else {
        adicionarMensagemIa(
          "Não foi possível obter uma resposta. Tente novamente."
        );
      }
    } catch (error) {
     
      console.error("Erro na requisição da API:", error);
      respostaContainer.removeChild(mensagemCarregamento);
      adicionarMensagemIa("Ocorreu um erro ao se comunicar com a IA.");
    }
  });

 
  function adicionarMensagemUsuario(texto) {
    const div = document.createElement("div");
    div.classList.add("mensagem", "mensagem-usuario");
    div.textContent = texto;
    respostaContainer.appendChild(div);
    // Rola para o final da conversa
    respostaContainer.scrollTop = respostaContainer.scrollHeight;
  }

 
  function adicionarMensagemIa(texto) {
    const div = document.createElement("div");
    div.classList.add("mensagem", "mensagem-ia");

    
    const html = marked.parse(texto);
    div.innerHTML = html;

    respostaContainer.appendChild(div);
    respostaContainer.scrollTop = respostaContainer.scrollHeight;
    return div;
  }
});

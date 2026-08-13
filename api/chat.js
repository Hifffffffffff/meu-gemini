export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Sem chave de API configurada' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Se o Google retornar um erro da API (chave inválida, etc)
    if (data.error) {
      return res.status(200).json({ resposta: `Erro da API: ${data.error.message}` });
    }

    const respostaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text || "O Gemini não retornou texto para essa pergunta.";
    return res.status(200).json({ resposta: respostaTexto });

  } catch (error) {
    return res.status(500).json({ resposta: 'Erro interno no servidor.' });
  }
}

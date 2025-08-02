const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.generateGemini = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') 
    return res.status(405).send('Method Not Allowed');

  const { prompt } = req.body;
  if (!prompt) 
    return res.status(400).send('Missing prompt');

  try {
    const apiKey = functions.config().gemini.key;
    const url = 'https://generativelanguage.googleapis.com/v1alpha2/models/gemini-1.5-flash:generateText';

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 1024,
        candidateCount: 1
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const { candidates } = await resp.json();
    res.json({ text: candidates[0]?.output || '' });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { prompt, model: requestedModel } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const DEFAULT_MODEL = 'gemini-2.0-flash-lite-001';

    if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL !== DEFAULT_MODEL) {
      console.warn(
        `Ignoring GEMINI_MODEL environment override (${process.env.GEMINI_MODEL}) in favour of ${DEFAULT_MODEL}.`
      );
    }

    if (requestedModel && requestedModel !== DEFAULT_MODEL) {
      console.warn(
        `Ignoring client-specified model (${requestedModel}); using ${DEFAULT_MODEL} instead.`
      );
    }

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const model = DEFAULT_MODEL;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error:', errorBody);
      res.status(502).json({
        error: 'Gemini API request failed.',
        details: errorBody,
      });
      return;
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


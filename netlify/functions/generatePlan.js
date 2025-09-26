const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // POST 요청이 아니면 에러 처리
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { prompt, model: requestedModel } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY; // Netlify에 저장된 API 키 사용
    const DEFAULT_MODEL = "gemini-2.0-flash-lite-001";

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
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required." }),
      };
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
      console.error("Gemini API Error:", errorBody);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Gemini API request failed.",
          details: errorBody,
        }),
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error("Internal Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

require('dotenv').config({ path: '../my-project/.env' });
const fetch = require('node-fetch') || function() { return import('node-fetch').then(m => m.default.apply(this, arguments)); };

async function testFetch() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return console.log("NO API KEY in .env");

  const promptToSend = "You are Drivana. History: User: hay i am satyam. Drivana:";
  
  const response = await globalThis.fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptToSend }] }]
      }),
    }
  );

  const data = await response.json();
  console.log("RESPONSE OK?", response.ok);
  console.log("DATA ERROR:", JSON.stringify(data.error, null, 2));
  console.log("FULL DATA:", JSON.stringify(data, null, 2));
}
testFetch();

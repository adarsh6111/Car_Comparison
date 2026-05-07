const fs = require("fs");
const path = require("path");
const carsData = require("./carsData");

const brands = [...new Set(carsData.map((car) => car.brand))];
const bodies = ["SUV", "Sedan", "Hatchback", "MPV"];
const transmissions = ["Automatic", "Manual", "CVT"];
const priorityMatchers = [
  ["mileage", "mileage"],
  ["safety", "safety"],
  ["power", "power"],
  ["family", "family"],
  ["city", "city"],
  ["highway", "highway"],
  ["comfort", "comfort"],
  ["feature", "features"],
  ["features", "features"],
  ["boot", "space"],
  ["space", "space"],
  ["low maintenance", "maintenance"],
  ["maintenance", "maintenance"],
];

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseEnvLine(fileContent, key) {
  const matcher = new RegExp(`^\\s*${key}\\s*=\\s*(.*)\\s*$`, "m");
  const match = fileContent.match(matcher);
  if (!match) return "";

  return match[1].trim().replace(/^['"]|['"]$/g, "");
}

function loadGeminiApiKey() {
  const directKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (directKey) return directKey.trim();

  const envFiles = [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "../my-project/.env"),
  ];

  for (const filePath of envFiles) {
    if (!fs.existsSync(filePath)) continue;

    const fileContent = fs.readFileSync(filePath, "utf8");
    const fileKey =
      parseEnvLine(fileContent, "GEMINI_API_KEY") ||
      parseEnvLine(fileContent, "VITE_GEMINI_API_KEY");

    if (fileKey) return fileKey;
  }

  return "";
}

function parseAmount(rawValue, rawUnit) {
  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue)) return null;

  const unit = normalizeText(rawUnit);
  if (unit.startsWith("crore") || unit === "cr") return Math.round(numericValue * 10000000);
  if (unit.startsWith("lakh") || unit === "lac" || unit === "lakhs") return Math.round(numericValue * 100000);
  if (unit === "k" || unit === "thousand") return Math.round(numericValue * 1000);

  return Math.round(numericValue);
}

function parseBudget(message) {
  const normalized = normalizeText(message);

  const betweenMatch = normalized.match(
    /between\s+(\d+(?:\.\d+)?)\s*(crore|cr|lakh|lac|lakhs|k|thousand)?\s+(?:and|to)\s+(\d+(?:\.\d+)?)\s*(crore|cr|lakh|lac|lakhs|k|thousand)?/
  );
  if (betweenMatch) {
    return {
      min: parseAmount(betweenMatch[1], betweenMatch[2]),
      max: parseAmount(betweenMatch[3], betweenMatch[4]),
    };
  }

  const singleMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*(crore|cr|lakh|lac|lakhs|k|thousand)?/
  );
  if (!singleMatch) return null;

  const amount = parseAmount(singleMatch[1], singleMatch[2]);
  if (!amount) return null;

  if (
    /(under|below|less than|max|maximum|upto|up to|budget|around)/.test(normalized)
  ) {
    return { max: amount };
  }

  if (/(above|over|minimum|min|more than|at least)/.test(normalized)) {
    return { min: amount };
  }

  return null;
}

function normalizeFuel(value = "") {
  const normalized = normalizeText(value);

  if (normalized === "ev" || normalized.includes("electric")) return "Electric";
  if (normalized.includes("hybrid")) return "Hybrid";
  if (normalized.includes("petrol")) return "Petrol";
  if (normalized.includes("diesel")) return "Diesel";
  if (normalized.includes("cng")) return "CNG";

  return "";
}

function extractName(message) {
  const match = message.match(/\b(?:i am|i'm|my name is)\s+([a-z][a-z\s]{1,30})/i);
  if (!match) return "";

  return titleCase(match[1].trim());
}

function findDirectCarMatches(message) {
  const normalizedMessage = normalizeText(message);
  const hasCarDetailIntent = /(about|detail|details|spec|specs|compare|vs|price|mileage|feature|features|tell me|know)/.test(
    normalizedMessage
  );

  return carsData.filter((car) => {
    const fullName = normalizeText(car.name);
    if (normalizedMessage.includes(fullName)) return true;

    const brandToken = normalizeText(car.brand);
    const modelTokens = fullName
      .split(" ")
      .filter((token) => token.length > 2 && token !== brandToken);

    if (modelTokens.length === 0) return false;
    if (normalizedMessage.includes(brandToken) && modelTokens.every((token) => normalizedMessage.includes(token))) {
      return true;
    }

    return hasCarDetailIntent && modelTokens.every((token) => normalizedMessage.includes(token));
  });
}

function mergeUniqueItems(existing = [], additions = []) {
  const nextItems = [...existing];

  for (const item of additions) {
    if (!item || nextItems.includes(item)) continue;
    nextItems.push(item);
  }

  return nextItems;
}

function updateMemory(currentMemory = {}, message = "", user = {}) {
  const normalized = normalizeText(message);
  const directMatches = findDirectCarMatches(message);
  const nextMemory = {
    userName: currentMemory.userName || "",
    budgetMin: currentMemory.budgetMin || null,
    budgetMax: currentMemory.budgetMax || null,
    fuel: currentMemory.fuel || "",
    transmission: currentMemory.transmission || "",
    bodyType: currentMemory.bodyType || "",
    seats: currentMemory.seats || null,
    brand: currentMemory.brand || "",
    priorities: Array.isArray(currentMemory.priorities) ? currentMemory.priorities : [],
    lastCarDiscussed: currentMemory.lastCarDiscussed || "",
  };

  if (user?.name) nextMemory.userName = user.name;

  const extractedName = extractName(message);
  if (extractedName) nextMemory.userName = extractedName;

  const budget = parseBudget(message);
  if (budget?.min) nextMemory.budgetMin = budget.min;
  if (budget?.max) nextMemory.budgetMax = budget.max;

  const fuel = normalizeFuel(message);
  if (fuel) nextMemory.fuel = fuel;

  const matchedTransmission = transmissions.find((item) =>
    normalized.includes(item.toLowerCase())
  );
  if (matchedTransmission) nextMemory.transmission = matchedTransmission;

  const matchedBody = bodies.find((item) => normalized.includes(item.toLowerCase()));
  if (matchedBody) nextMemory.bodyType = matchedBody;

  const seatsMatch = normalized.match(/(\d+)\s*(?:seat|seater|seats)/);
  if (seatsMatch) nextMemory.seats = Number(seatsMatch[1]);

  const matchedBrand = brands.find((brand) => normalized.includes(brand.toLowerCase()));
  if (matchedBrand) nextMemory.brand = matchedBrand;

  const matchedPriorities = priorityMatchers
    .filter(([keyword]) => normalized.includes(keyword))
    .map(([, label]) => label);
  nextMemory.priorities = mergeUniqueItems(nextMemory.priorities, matchedPriorities);

  if (directMatches.length > 0) nextMemory.lastCarDiscussed = directMatches[0].name;

  return nextMemory;
}

function scoreCar(car, memory, message, directNames) {
  const normalizedMessage = normalizeText(message);
  let score = 0;

  if (directNames.has(car.name)) score += 100;
  if (memory.brand && car.brand.toLowerCase() === memory.brand.toLowerCase()) score += 15;
  if (memory.bodyType && car.body.toLowerCase() === memory.bodyType.toLowerCase()) score += 12;
  if (memory.fuel && normalizeFuel(car.fuel) === normalizeFuel(memory.fuel)) score += 12;
  if (
    memory.transmission &&
    car.transmission.toLowerCase().includes(memory.transmission.toLowerCase())
  ) {
    score += 10;
  }
  if (memory.seats && car.seats >= memory.seats) score += 8;

  if (memory.budgetMax) {
    if (car.price <= memory.budgetMax) score += 16;
    else if (car.price <= memory.budgetMax * 1.1) score += 6;
    else score -= 12;
  }

  if (memory.budgetMin) {
    if (car.price >= memory.budgetMin) score += 4;
    else score -= 5;
  }

  const priorities = Array.isArray(memory.priorities) ? memory.priorities : [];
  if (priorities.includes("mileage")) score += car.mileage;
  if (priorities.includes("safety")) score += car.safety * 4;
  if (priorities.includes("power")) score += Number.parseInt(car.power, 10) / 4;
  if (priorities.includes("family")) score += car.seats * 2 + (car.body === "SUV" || car.body === "MPV" ? 5 : 0);
  if (priorities.includes("city")) score += car.mileage + (car.body === "Hatchback" ? 5 : 0);
  if (priorities.includes("highway")) score += Number.parseInt(car.power, 10) / 5 + (car.body === "SUV" ? 4 : 0);
  if (priorities.includes("comfort")) score += car.seats + (car.transmission !== "Manual" ? 3 : 0);
  if (priorities.includes("features")) score += car.safety * 2;
  if (priorities.includes("space")) score += car.seats * 2 + (car.body === "MPV" ? 4 : 0);
  if (priorities.includes("maintenance")) score += car.mileage;

  if (normalizedMessage.includes("cheap") || normalizedMessage.includes("affordable")) {
    score += Math.max(0, 50 - car.price / 100000);
  }

  score += car.safety * 1.5;
  return score;
}

function getRecommendedCars(message, memory, directMatches) {
  const directNames = new Set(directMatches.map((car) => car.name));

  return [...carsData]
    .sort((left, right) => scoreCar(right, memory, message, directNames) - scoreCar(left, memory, message, directNames))
    .slice(0, 3);
}

function summarizeMemory(memory) {
  const chunks = [];

  if (memory.userName) chunks.push(`your name is ${memory.userName}`);
  if (memory.budgetMax) chunks.push(`budget is around ${formatPrice(memory.budgetMax)} or below`);
  if (memory.budgetMin) chunks.push(`minimum budget is around ${formatPrice(memory.budgetMin)}`);
  if (memory.fuel) chunks.push(`you prefer ${memory.fuel.toLowerCase()}`);
  if (memory.transmission) chunks.push(`you want ${memory.transmission.toLowerCase()}`);
  if (memory.bodyType) chunks.push(`you are looking for a ${memory.bodyType.toLowerCase()}`);
  if (memory.seats) chunks.push(`you need about ${memory.seats} seats`);
  if (memory.brand) chunks.push(`you like ${memory.brand}`);

  return chunks.join(", ");
}

function wantsCarDetails(message, directMatches) {
  if (!directMatches.length) return false;

  const normalized = normalizeText(message);
  const detailKeywords = [
    "about",
    "detail",
    "details",
    "spec",
    "specs",
    "feature",
    "features",
    "price",
    "mileage",
    "power",
    "safety",
    "seat",
  ];

  return detailKeywords.some((keyword) => normalized.includes(keyword));
}

function isGreeting(message) {
  const normalized = normalizeText(message);
  return ["hi", "hello", "hey", "hii", "hola"].includes(normalized);
}

function buildCarSummary(car) {
  return `${car.name} - ${formatPrice(car.price)}, ${car.fuel}, ${car.transmission}, ${car.mileage} km/l, ${car.seats} seats, safety ${car.safety}/5.`;
}

function buildLocalReply({ message, memory, directMatches, recommendedCars }) {
  if (isGreeting(message)) {
    const remembered = summarizeMemory(memory);
    if (remembered) {
      return `Hi. I remember that ${remembered}. Ask for a recommendation or say a car name like Creta for full details.`;
    }

    return "Hi. Tell me your budget, fuel type, body style, or a car name, and I will help you choose.";
  }

  if (wantsCarDetails(message, directMatches)) {
    const car = directMatches[0];
    return `${car.name} is a ${car.body.toLowerCase()} from ${car.brand}. It costs about ${formatPrice(car.price)}, gives ${car.mileage} km/l, comes with ${car.fuel} and ${car.transmission}, makes ${car.power}, has ${car.seats} seats, and safety is ${car.safety}/5. If you want, I can also compare it with another car.`;
  }

  if (recommendedCars.length > 0) {
    const remembered = summarizeMemory(memory);
    const intro = remembered
      ? `Based on what I remember, ${remembered}. These are strong options:`
      : "These are strong options for you:";

    return [
      intro,
      ...recommendedCars.map((car, index) => `${index + 1}. ${buildCarSummary(car)}`),
      "If you want, ask for details about any one of them.",
    ].join("\n");
  }

  return "Tell me a budget like under 15 lakh, your fuel preference, or a car name, and I will narrow it down.";
}

function historyToTranscript(history = []) {
  return history
    .slice(-8)
    .map((item) => `${item.from === "user" ? "User" : "Drivana"}: ${item.text}`)
    .join("\n");
}

async function getGeminiReply({ message, history, memory, directMatches, recommendedCars, user }) {
  const apiKey = loadGeminiApiKey();
  if (!apiKey || typeof fetch !== "function") return null;

  const relevantCars = directMatches.length > 0 ? directMatches.slice(0, 3) : recommendedCars.slice(0, 3);
  const prompt = [
    "You are Drivana AI, a helpful car-buying assistant for Indian users.",
    "Reply in plain text only.",
    "Be conversational, easy to understand, and concise.",
    "Use remembered preferences when they help.",
    "If local car data is provided, use only that data for specs and pricing. Do not invent numbers.",
    "If the user asks for recommendations, suggest up to 3 cars with short reasons.",
    "If the user asks for car details, explain the car in simple language and mention price, mileage, fuel, transmission, power, seats, and safety.",
    "If you do not have an exact local match, say that clearly and suggest the closest useful options.",
    "",
    `Logged in user: ${JSON.stringify({ name: user?.name || memory.userName || "" })}`,
    `Remembered preferences: ${JSON.stringify(memory, null, 2)}`,
    `Recent chat history:\n${historyToTranscript(history) || "No recent history."}`,
    `Relevant local car data:\n${JSON.stringify(relevantCars, null, 2)}`,
    `Current user message: ${message}`,
    "Answer as Drivana AI:",
  ].join("\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!response.ok || !text) return null;
    return text;
  } catch {
    return null;
  }
}

async function buildChatResponse({ message, history = [], memory = {}, user = {} }) {
  const nextMemory = updateMemory(memory, message, user);
  const directMatches = findDirectCarMatches(message).slice(0, 3);
  const recommendedCars = getRecommendedCars(message, nextMemory, directMatches);
  const geminiReply = await getGeminiReply({
    message,
    history,
    memory: nextMemory,
    directMatches,
    recommendedCars,
    user,
  });

  return {
    reply: geminiReply || buildLocalReply({ message, memory: nextMemory, directMatches, recommendedCars }),
    memory: nextMemory,
    matchedCars: directMatches,
    recommendedCars,
    usedGemini: Boolean(geminiReply),
  };
}

module.exports = {
  buildChatResponse,
};

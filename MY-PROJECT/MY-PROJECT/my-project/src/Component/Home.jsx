import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, User, LogOut, Search, Star } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const QUICK_PROMPTS = [
  "Suggest an SUV under 15 lakh",
  "Which car gives the best mileage?",
  "Tell me Hyundai Creta details",
];

function getChatStorageKey(user) {
  return `drivana-chat-${user?.id || user?.email || "guest"}`;
}

function getMemoryStorageKey(user) {
  return `drivana-memory-${user?.id || user?.email || "guest"}`;
}

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue || rawValue === "undefined") return fallbackValue;
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

function buildWelcomeMessage(user) {
  const name = user?.name ? ` ${user.name}` : "";

  return {
    from: "bot",
    text: `Hi${name}. I can remember your budget, fuel type, and car preferences on this device. Ask for a recommendation or say a car name like "Creta details".`,
  };
}

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showBot, setShowBot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [memory, setMemory] = useState({});
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatReady, setChatReady] = useState(false);

  const carImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    setChatReady(false);

    const savedMessages = readStoredJson(getChatStorageKey(user), []);
    const savedMemory = readStoredJson(getMemoryStorageKey(user), {});

    setMessages(savedMessages.length > 0 ? savedMessages : [buildWelcomeMessage(user)]);
    setMemory(savedMemory);
    setChatReady(true);
  }, [user]);

  useEffect(() => {
    if (!user || !chatReady) return;

    localStorage.setItem(getChatStorageKey(user), JSON.stringify(messages));
    localStorage.setItem(getMemoryStorageKey(user), JSON.stringify(memory));
  }, [chatReady, messages, memory, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carImages.length]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const resetChatMemory = () => {
    if (!user) return;

    localStorage.removeItem(getChatStorageKey(user));
    localStorage.removeItem(getMemoryStorageKey(user));
    setMessages([buildWelcomeMessage(user)]);
    setMemory({});
  };

  const sendMessage = async (overrideText) => {
    const nextText = (overrideText ?? input).trim();
    if (!nextText || isSending || !user) return;

    const userMessage = { from: "user", text: nextText };
    const nextHistory = [...messages, userMessage].slice(-8);

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowBot(true);
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: nextText,
          history: nextHistory,
          memory,
          user,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to chat right now.");

      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      setMemory(data.memory || {});
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I could not reach the AI service right now. Please make sure the backend is running on port 5000.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/60 px-8 py-4 shadow-lg">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Car className="text-yellow-400" /> Drivana
        </h1>

        <nav className="flex gap-6 text-lg">
          <button onClick={() => navigate("/home")} className="transition hover:text-yellow-400">
            Home
          </button>
          <button onClick={() => navigate("/compare")} className="transition hover:text-yellow-400">
            Compare
          </button>
          <button onClick={() => navigate("/budget")} className="transition hover:text-yellow-400">
            Budget Finder
          </button>
          <button onClick={() => navigate("/challan")} className="transition hover:text-yellow-400">
            Challan
          </button>
          <button onClick={() => navigate("/features")} className="transition hover:text-yellow-400">
            Features
          </button>
        </nav>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300">
            <User size={18} /> {user ? user.name : "Profile"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-6 text-4xl font-extrabold md:text-5xl">
          {user ? `Welcome, ${user.name}!` : "Find and compare your dream car"}
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
          {user
            ? `Your email: ${user.email} | Phone: ${user.phone || "N/A"}`
            : "Compare cars, filter by budget, and get smart recommendations."}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/compare")}
            className="flex items-center gap-2 rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
          >
            <Search size={18} /> Compare Cars
          </button>
          <button
            onClick={() => setShowBot(true)}
            className="flex items-center gap-2 rounded-lg bg-pink-500 px-6 py-3 font-bold transition hover:bg-pink-600"
          >
            <Star size={18} /> Ask Drivana AI
          </button>
        </div>
      </section>

      <section className="flex w-full justify-center py-10">
        <div className="relative h-64 w-11/12 overflow-hidden rounded-xl shadow-2xl md:h-96 md:w-3/4">
          <img
            src={carImages[current]}
            alt="Featured car"
            className="h-full w-full object-cover transition-all duration-700"
          />
          <div className="absolute bottom-3 flex w-full justify-center gap-2">
            {carImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`h-3 w-3 rounded-full ${index === current ? "bg-yellow-400" : "bg-gray-500"}`}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <div>
        {!showBot && (
          <button
            onClick={() => setShowBot(true)}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-yellow-400 px-6 py-3 font-bold text-black shadow-xl transition hover:bg-yellow-300"
          >
            AI Car Finder
          </button>
        )}

        {showBot && (
          <div className="fixed bottom-6 right-6 z-50 w-[22rem] rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl md:w-96">
            <div className="flex items-start justify-between rounded-t-2xl bg-black p-4">
              <div>
                <h3 className="font-bold text-yellow-400">Drivana AI</h3>
                <p className="text-xs text-gray-400">Remembers your preferences on this device</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetChatMemory}
                  className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-300 transition hover:border-yellow-400 hover:text-yellow-300"
                >
                  Reset
                </button>
                <button type="button" onClick={() => setShowBot(false)} className="text-gray-300 transition hover:text-white">
                  X
                </button>
              </div>
            </div>

            <div className="border-b border-gray-800 px-3 py-2">
              <p className="text-xs text-gray-400">
                Try: SUV under 15 lakh, best mileage car, or Creta details
              </p>
            </div>

            <div className="h-80 space-y-3 overflow-y-auto p-3">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.from}-${index}`}
                  className={`max-w-[92%] rounded-xl p-3 ${
                    msg.from === "user"
                      ? "ml-auto bg-yellow-400 text-black"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                </div>
              ))}

              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-200 transition hover:border-yellow-400 hover:text-yellow-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {isSending && (
                <div className="max-w-[92%] rounded-xl bg-gray-800 p-3 text-sm text-gray-300">
                  Drivana is thinking...
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-gray-700 p-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Ask for a car recommendation or details..."
                className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-white outline-none ring-0 placeholder:text-gray-500"
              />
              <button
                type="button"
                disabled={isSending}
                onClick={() => sendMessage()}
                className="rounded-lg bg-yellow-400 px-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-yellow-700"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="grid grid-cols-1 gap-8 px-10 py-16 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-gray-800 p-6 shadow-lg transition hover:scale-105">
          <h3 className="mb-3 text-xl font-semibold">Car Comparison</h3>
          <p className="text-gray-300">Select two cars and instantly compare specs.</p>
        </div>
        <div className="rounded-xl bg-gray-800 p-6 shadow-lg transition hover:scale-105">
          <h3 className="mb-3 text-xl font-semibold">Budget Finder</h3>
          <p className="text-gray-300">Get the best cars in your price range.</p>
        </div>
        <div className="rounded-xl bg-gray-800 p-6 shadow-lg transition hover:scale-105">
          <h3 className="mb-3 text-xl font-semibold">Challan Tracker</h3>
          <p className="text-gray-300">View challan records, pending fines, and status summaries.</p>
        </div>
        <div className="rounded-xl bg-gray-800 p-6 shadow-lg transition hover:scale-105">
          <h3 className="mb-3 text-xl font-semibold">Smart Recommendations</h3>
          <p className="text-gray-300">AI-backed suggestions using remembered preferences.</p>
        </div>
      </section>

      <footer className="mt-10 bg-black/70 py-6 text-center">
        <p className="text-gray-400"> 2026 Drivana. Built for your major project.</p>
      </footer>
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { ArrowLeft, Search, Trash2, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const MAX_COMPARE_CARS = 10;

const COMPARISON_ROWS = [
  { key: "price", label: "Price", format: (car) => formatPrice(car.price), rankBy: "lowest", score: (car) => car.price },
  { key: "brand", label: "Brand", format: (car) => car.brand },
  { key: "body", label: "Body Type", format: (car) => car.body },
  { key: "fuel", label: "Fuel Type", format: (car) => car.fuel },
  { key: "mileage", label: "Mileage", format: (car) => `${car.mileage} km/l`, rankBy: "highest", score: (car) => car.mileage },
  { key: "power", label: "Power", format: (car) => car.power, rankBy: "highest", score: (car) => Number.parseInt(car.power, 10) || 0 },
  { key: "transmission", label: "Transmission", format: (car) => car.transmission },
  { key: "seats", label: "Seating", format: (car) => `${car.seats} seats`, rankBy: "highest", score: (car) => car.seats },
  { key: "safety", label: "Safety", format: (car) => `${car.safety}/5`, rankBy: "highest", score: (car) => car.safety },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStoredCars() {
  try {
    const storedCars = localStorage.getItem("compareCars");
    if (!storedCars || storedCars === "undefined") return [];
    const parsedCars = JSON.parse(storedCars);
    return Array.isArray(parsedCars) ? parsedCars : [];
  } catch {
    return [];
  }
}

function getHighlights(cars) {
  if (cars.length === 0) return [];

  const bestMileage = [...cars].sort((left, right) => right.mileage - left.mileage)[0];
  const bestPower = [...cars].sort(
    (left, right) => (Number.parseInt(right.power, 10) || 0) - (Number.parseInt(left.power, 10) || 0)
  )[0];
  const safest = [...cars].sort((left, right) => right.safety - left.safety)[0];
  const bestBudget = [...cars].sort((left, right) => left.price - right.price)[0];

  return [
    { label: "Most Affordable", car: bestBudget.name, note: formatPrice(bestBudget.price) },
    { label: "Best Mileage", car: bestMileage.name, note: `${bestMileage.mileage} km/l` },
    { label: "Top Performance", car: bestPower.name, note: bestPower.power },
    { label: "Safest Pick", car: safest.name, note: `${safest.safety}/5 safety` },
  ];
}

function getWinningCars(cars, row) {
  if (!row.score || cars.length < 2) return new Set();

  const scores = cars.map((car) => row.score(car));
  const winningScore = row.rankBy === "lowest" ? Math.min(...scores) : Math.max(...scores);

  return new Set(
    cars
      .filter((car) => row.score(car) === winningScore)
      .map((car) => car.name)
  );
}

const Compare = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setSelectedCars(getStoredCars());
  }, []);

  useEffect(() => {
    localStorage.setItem("compareCars", JSON.stringify(selectedCars));
    setAiSuggestions(getHighlights(selectedCars));
  }, [selectedCars]);

  useEffect(() => {
    let isMounted = true;

    async function loadCars() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(`${API_BASE_URL}/api/cars`);
        if (!response.ok) throw new Error("Could not load cars");

        const data = await response.json();
        if (isMounted) setCars(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setLoadError("Could not load the car list. Please make sure the backend is running.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCars();

    return () => {
      isMounted = false;
    };
  }, []);

  const addCar = (car) => {
    if (selectedCars.length >= MAX_COMPARE_CARS) {
      alert(`You can compare up to ${MAX_COMPARE_CARS} cars at a time.`);
      return;
    }

    if (selectedCars.some((selectedCar) => selectedCar.name === car.name)) return;
    setSelectedCars((prev) => [...prev, car]);
    setSearch("");
  };

  const removeCar = (name) => {
    setSelectedCars((prev) => prev.filter((car) => car.name !== name));
  };

  const filteredCars = cars
    .filter((car) => {
      if (!search.trim()) return false;

      const searchValue = search.toLowerCase();
      return (
        car.name.toLowerCase().includes(searchValue) ||
        car.brand.toLowerCase().includes(searchValue) ||
        car.body.toLowerCase().includes(searchValue)
      );
    })
    .slice(0, 8);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_28%),linear-gradient(160deg,_#050816,_#10172c_55%,_#0b1120)] text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-6rem] top-20 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute right-[-4rem] top-48 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-yellow-400/60 hover:bg-yellow-400/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">Drivana Studio</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Compare Cars</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Head-to-head view</p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              Pick up to ten cars and see the real differences without the messy table feel.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Search by car name, brand, or body type. The compare board highlights affordability,
              mileage, performance, and safety so the strongest options stand out quickly.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 p-4">
              <p className="text-sm text-yellow-200">Cars selected</p>
              <p className="mt-1 text-3xl font-semibold">{selectedCars.length}</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm text-cyan-100">Compare limit</p>
              <p className="mt-1 text-3xl font-semibold">{MAX_COMPARE_CARS}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-300">Catalog loaded</p>
              <p className="mt-1 text-3xl font-semibold">{cars.length || 0}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.3)]"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Find cars to add</h3>
              <p className="text-sm text-slate-400">Search by model, brand, or body type.</p>
            </div>
            <p className="text-sm text-slate-400">
              {selectedCars.length}/{MAX_COMPARE_CARS} selected
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search cars by name, brand, or body type..."
              className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {isLoading && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Loading car catalog...
            </div>
          )}

          {loadError && (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {loadError}
            </div>
          )}

          {search.trim() && !isLoading && !loadError && (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => {
                  const isSelected = selectedCars.some((selectedCar) => selectedCar.name === car.name);

                  return (
                    <button
                      key={car.name}
                      type="button"
                      onClick={() => addCar(car)}
                      disabled={isSelected}
                      className={`overflow-hidden rounded-2xl border text-left transition ${
                        isSelected
                          ? "cursor-not-allowed border-yellow-400/30 bg-yellow-400/10 opacity-70"
                          : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                      }`}
                    >
                      <img src={car.image} alt={car.name} className="h-40 w-full object-cover" />
                      <div className="space-y-3 p-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{car.brand}</p>
                          <h4 className="mt-1 text-lg font-semibold">{car.name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                          <span className="rounded-full bg-white/8 px-2.5 py-1">{car.body}</span>
                          <span className="rounded-full bg-white/8 px-2.5 py-1">{car.fuel}</span>
                          <span className="rounded-full bg-white/8 px-2.5 py-1">{car.transmission}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-yellow-300">{formatPrice(car.price)}</span>
                          <span className="text-sm text-slate-300">
                            {isSelected ? "Added" : "Add to compare"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300 md:col-span-2 xl:col-span-4">
                  No matching cars found for that search.
                </div>
              )}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Selected Cars</h3>
              <p className="text-sm text-slate-400">Your comparison lineup stays saved in this browser.</p>
            </div>
          </div>

          {selectedCars.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedCars.map((car) => (
                <div
                  key={car.name}
                  className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/55 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                >
                  <div className="relative">
                    <img src={car.image} alt={car.name} className="h-52 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeCar(car.name)}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/85 text-red-300 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/80">{car.brand}</p>
                      <h4 className="mt-1 text-2xl font-semibold">{car.name}</h4>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-slate-200">
                      <span className="rounded-full bg-white/8 px-3 py-1.5">{car.body}</span>
                      <span className="rounded-full bg-white/8 px-3 py-1.5">{car.fuel}</span>
                      <span className="rounded-full bg-white/8 px-3 py-1.5">{car.transmission}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-slate-400">Price</p>
                        <p className="mt-1 font-semibold text-yellow-300">{formatPrice(car.price)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-slate-400">Mileage</p>
                        <p className="mt-1 font-semibold">{car.mileage} km/l</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-slate-400">Power</p>
                        <p className="mt-1 font-semibold">{car.power}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-slate-400">Safety</p>
                        <p className="mt-1 font-semibold">{car.safety}/5</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
              <p className="text-2xl font-semibold">No cars selected yet</p>
              <p className="mt-3 text-slate-400">
                Search above and add a few cars to start a cleaner side-by-side comparison.
              </p>
            </div>
          )}
        </motion.section>

        {aiSuggestions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-[28px] border border-yellow-400/20 bg-yellow-400/10 p-5"
          >
            <div className="flex items-center gap-2 text-yellow-200">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Quick Highlights</h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {aiSuggestions.map((item) => (
                <div key={item.label} className="rounded-2xl border border-yellow-300/15 bg-slate-950/45 p-4">
                  <div className="flex items-center gap-2 text-sm text-yellow-200">
                    <Star className="h-4 w-4" />
                    {item.label}
                  </div>
                  <p className="mt-3 text-lg font-semibold">{item.car}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.note}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {selectedCars.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.28)]"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Comparison Board</h3>
              <p className="text-sm text-slate-400">
                Scroll sideways on smaller screens. Highlighted cells show the strongest values.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 w-44 rounded-l-3xl border-b border-white/10 bg-slate-950 px-4 py-5 text-left text-sm uppercase tracking-[0.22em] text-slate-400">
                      Specs
                    </th>
                    {selectedCars.map((car) => (
                      <th
                        key={car.name}
                        className="border-b border-white/10 bg-slate-950 px-4 py-5 text-left align-top last:rounded-r-3xl"
                      >
                        <div className="space-y-3">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="h-36 w-full rounded-2xl object-cover shadow-lg"
                          />
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">{car.brand}</p>
                            <h4 className="mt-1 text-xl font-semibold">{car.name}</h4>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {COMPARISON_ROWS.map((row) => {
                    const winningCars = getWinningCars(selectedCars, row);

                    return (
                      <tr key={row.key}>
                        <td className="sticky left-0 z-10 border-b border-white/10 bg-slate-950 px-4 py-4 text-sm font-medium text-slate-300">
                          {row.label}
                        </td>
                        {selectedCars.map((car) => {
                          const isWinner = winningCars.has(car.name);

                          return (
                            <td
                              key={`${row.key}-${car.name}`}
                              className={`border-b border-white/10 px-4 py-4 text-sm ${
                                isWinner
                                  ? "bg-emerald-400/10 text-emerald-100"
                                  : "bg-transparent text-slate-100"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{row.format(car)}</span>
                                {isWinner && (
                                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                                    Best
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default Compare;

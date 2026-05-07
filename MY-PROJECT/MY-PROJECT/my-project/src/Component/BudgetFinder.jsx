import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CarFront,
  Fuel,
  Gauge,
  IndianRupee,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const FILTER_STORAGE_KEY = "drivana-budget-filters";
const DEFAULT_FILTERS = {
  search: "",
  budgetMax: "1500000",
  fuel: "",
  transmission: "",
  body: "",
  sortBy: "bestMatch",
};
const BUDGET_PRESETS = [
  { label: "8L", value: "800000" },
  { label: "12L", value: "1200000" },
  { label: "15L", value: "1500000" },
  { label: "20L", value: "2000000" },
  { label: "30L", value: "3000000" },
];
const FEATURED_LABELS = ["Best Overall", "Best Value", "Worth Shortlisting"];

function formatPrice(value) {
  if (!Number.isFinite(value)) return "N/A";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSavedFilters() {
  try {
    const rawValue = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!rawValue || rawValue === "undefined") return DEFAULT_FILTERS;

    const parsedValue = JSON.parse(rawValue);
    return { ...DEFAULT_FILTERS, ...parsedValue };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function getBestMatchScore(car, budgetMax) {
  const power = Number.parseInt(car.power, 10) || 0;
  let score = car.safety * 18 + car.mileage * 4 + power / 8;

  if (budgetMax > 0) {
    const utilization = Math.min(car.price / budgetMax, 1);
    score += utilization * 30;
  }

  if (car.transmission === "Automatic" || car.transmission === "CVT") score += 4;
  if (car.body === "SUV" || car.body === "MPV") score += 3;

  return score;
}

const BudgetFinder = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setFilters(getSavedFilters());
  }, []);

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    async function loadCars() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(`${API_BASE_URL}/api/cars`);
        if (!response.ok) throw new Error("Unable to fetch cars");

        const data = await response.json();
        if (isMounted) setCars(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) {
          setLoadError("Could not load the car catalog. Please make sure the backend is running on port 5000.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCars();

    return () => {
      isMounted = false;
    };
  }, []);

  const budgetMax = Number(filters.budgetMax) || 0;
  const searchValue = filters.search.trim().toLowerCase();

  let filteredCars = cars.filter((car) => {
    const matchesSearch =
      !searchValue ||
      car.name.toLowerCase().includes(searchValue) ||
      car.brand.toLowerCase().includes(searchValue);
    const matchesBudget = !budgetMax || car.price <= budgetMax;
    const matchesFuel = !filters.fuel || car.fuel === filters.fuel;
    const matchesTransmission =
      !filters.transmission || car.transmission === filters.transmission;
    const matchesBody = !filters.body || car.body === filters.body;

    return (
      matchesSearch &&
      matchesBudget &&
      matchesFuel &&
      matchesTransmission &&
      matchesBody
    );
  });

  if (filters.sortBy === "priceLow") {
    filteredCars = [...filteredCars].sort((left, right) => left.price - right.price);
  } else if (filters.sortBy === "mileageHigh") {
    filteredCars = [...filteredCars].sort((left, right) => right.mileage - left.mileage);
  } else if (filters.sortBy === "safetyHigh") {
    filteredCars = [...filteredCars].sort((left, right) => right.safety - left.safety);
  } else {
    filteredCars = [...filteredCars].sort(
      (left, right) => getBestMatchScore(right, budgetMax) - getBestMatchScore(left, budgetMax)
    );
  }

  const featuredCars = filteredCars.slice(0, 3);
  const fuels = [...new Set(cars.map((car) => car.fuel))].sort();
  const transmissions = [...new Set(cars.map((car) => car.transmission))].sort();
  const bodyTypes = [...new Set(cars.map((car) => car.body))].sort();
  const cheapestCar =
    filteredCars.length > 0
      ? [...filteredCars].sort((left, right) => left.price - right.price)[0]
      : null;
  const highestMileageCar =
    filteredCars.length > 0
      ? [...filteredCars].sort((left, right) => right.mileage - left.mileage)[0]
      : null;
  const averagePrice =
    filteredCars.length > 0
      ? Math.round(
          filteredCars.reduce((total, car) => total + car.price, 0) / filteredCars.length
        )
      : 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(250,204,21,0.12),_transparent_24%),linear-gradient(160deg,_#050816,_#10172c_52%,_#090f1a)] text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-5rem] top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-12 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
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
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Drivana Studio</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Budget Finder</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.3)] lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-300/80">Smart shortlist</p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              Find cars that actually fit your budget without scrolling through messy lists.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              This page updates instantly as you change the budget, fuel type, transmission,
              and body style. It surfaces the strongest matches first so the page feels fast
              and useful instead of making you hit search again and again.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
              <p className="text-sm text-yellow-200">Current budget</p>
              <p className="mt-1 text-3xl font-semibold">
                {budgetMax ? formatPrice(budgetMax) : "No limit"}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm text-cyan-100">Matching cars</p>
              <p className="mt-1 text-3xl font-semibold">{filteredCars.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-4">
              <p className="text-sm text-slate-300">Average shortlist price</p>
              <p className="mt-1 text-3xl font-semibold">
                {filteredCars.length > 0 ? formatPrice(averagePrice) : "N/A"}
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[30px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Tune your shortlist</h3>
              <p className="text-sm text-slate-400">
                Results refresh automatically as you change any filter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-slate-400">
                <IndianRupee className="h-4 w-4" />
                Budget Target
              </div>

              <input
                type="number"
                min="0"
                value={filters.budgetMax}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, budgetMax: event.target.value }))
                }
                placeholder="Enter max budget in INR"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-lg text-white outline-none placeholder:text-slate-500 focus:border-yellow-400/40"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {BUDGET_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, budgetMax: preset.value }))
                    }
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      filters.budgetMax === preset.value
                        ? "bg-yellow-400 text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-200 hover:border-yellow-400/40 hover:bg-yellow-400/10"
                    }`}
                  >
                    Under {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                placeholder="Search by car or brand"
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 sm:col-span-2"
              />

              <select
                value={filters.fuel}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, fuel: event.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
              >
                <option value="">All fuel types</option>
                {fuels.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>

              <select
                value={filters.transmission}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, transmission: event.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
              >
                <option value="">All transmissions</option>
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>

              <select
                value={filters.body}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, body: event.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
              >
                <option value="">All body types</option>
                {bodyTypes.map((body) => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, sortBy: event.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-cyan-300/40"
              >
                <option value="bestMatch">Sort by best match</option>
                <option value="priceLow">Price: low to high</option>
                <option value="mileageHigh">Mileage: high to low</option>
                <option value="safetyHigh">Safety: high to low</option>
              </select>
            </div>
          </div>
        </motion.section>

        {loadError && (
          <div className="rounded-[26px] border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {loadError}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[26px] border border-white/10 bg-white/5 px-6 py-16 text-center text-slate-300">
            Loading the car catalog...
          </div>
        ) : (
          <>
            {filteredCars.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="rounded-[28px] border border-yellow-400/20 bg-yellow-400/10 p-5">
                  <div className="flex items-center gap-2 text-yellow-200">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Budget Snapshot</h3>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <p className="text-sm text-slate-400">Cheapest option</p>
                      <p className="mt-1 text-lg font-semibold">{cheapestCar?.name || "N/A"}</p>
                      <p className="text-sm text-yellow-300">
                        {cheapestCar ? formatPrice(cheapestCar.price) : ""}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <p className="text-sm text-slate-400">Highest mileage</p>
                      <p className="mt-1 text-lg font-semibold">
                        {highestMileageCar?.name || "N/A"}
                      </p>
                      <p className="text-sm text-cyan-200">
                        {highestMileageCar ? `${highestMileageCar.mileage} km/l` : ""}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <p className="text-sm text-slate-400">Shortlist size</p>
                      <p className="mt-1 text-lg font-semibold">{filteredCars.length} cars</p>
                      <p className="text-sm text-slate-300">Refined by your current filters</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {featuredCars.map((car, index) => (
                    <div
                      key={car.name}
                      className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/55 shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
                    >
                      <img src={car.image} alt={car.name} className="h-44 w-full object-cover" />
                      <div className="space-y-3 p-4">
                        <span className="inline-flex rounded-full bg-cyan-300/12 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">
                          {FEATURED_LABELS[index] || "Top Pick"}
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{car.brand}</p>
                          <h3 className="mt-1 text-xl font-semibold">{car.name}</h3>
                        </div>
                        <p className="text-lg font-semibold text-yellow-300">
                          {formatPrice(car.price)}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
                          <span className="rounded-xl bg-white/5 px-3 py-2">{car.fuel}</span>
                          <span className="rounded-xl bg-white/5 px-3 py-2">{car.body}</span>
                          <span className="rounded-xl bg-white/5 px-3 py-2">{car.mileage} km/l</span>
                          <span className="rounded-xl bg-white/5 px-3 py-2">{car.safety}/5 safety</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-[30px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Matching Cars</h3>
                  <p className="text-sm text-slate-400">
                    Sorted using your selected view. Every result updates live.
                  </p>
                </div>
                <p className="text-sm text-slate-400">
                  Showing {filteredCars.length} result{filteredCars.length === 1 ? "" : "s"}
                </p>
              </div>

              {filteredCars.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCars.map((car) => (
                    <div
                      key={car.name}
                      className="overflow-hidden rounded-[26px] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-yellow-400/35 hover:bg-white/[0.07]"
                    >
                      <img src={car.image} alt={car.name} className="h-48 w-full object-cover" />
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{car.brand}</p>
                            <h4 className="mt-1 text-2xl font-semibold">{car.name}</h4>
                          </div>
                          <span className="rounded-full bg-yellow-400/12 px-3 py-1 text-sm text-yellow-200">
                            {formatPrice(car.price)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-900/75 p-3">
                            <p className="flex items-center gap-2 text-slate-400">
                              <Fuel className="h-4 w-4" />
                              Fuel
                            </p>
                            <p className="mt-2 font-medium text-slate-100">{car.fuel}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900/75 p-3">
                            <p className="flex items-center gap-2 text-slate-400">
                              <CarFront className="h-4 w-4" />
                              Body
                            </p>
                            <p className="mt-2 font-medium text-slate-100">{car.body}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900/75 p-3">
                            <p className="flex items-center gap-2 text-slate-400">
                              <Gauge className="h-4 w-4" />
                              Mileage
                            </p>
                            <p className="mt-2 font-medium text-slate-100">{car.mileage} km/l</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900/75 p-3">
                            <p className="flex items-center gap-2 text-slate-400">
                              <ShieldCheck className="h-4 w-4" />
                              Safety
                            </p>
                            <p className="mt-2 font-medium text-slate-100">{car.safety}/5</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900/75 p-3">
                            <p className="text-slate-400">Transmission</p>
                            <p className="mt-2 font-medium text-slate-100">{car.transmission}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900/75 p-3">
                            <p className="flex items-center gap-2 text-slate-400">
                              <Users className="h-4 w-4" />
                              Seats
                            </p>
                            <p className="mt-2 font-medium text-slate-100">{car.seats} seats</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[26px] border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
                  <p className="text-2xl font-semibold">No cars match those filters</p>
                  <p className="mt-3 text-slate-400">
                    Try increasing your budget or clearing one of the filters to widen the shortlist.
                  </p>
                </div>
              )}
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
};

export default BudgetFinder;

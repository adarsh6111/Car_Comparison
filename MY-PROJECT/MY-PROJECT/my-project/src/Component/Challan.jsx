import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CarFront,
  CheckCircle2,
  ClipboardList,
  Search,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ROAD_SAFETY_TIPS = [
  {
    title: "Always wear a seat belt",
    description: "Every passenger should buckle up, including rear-seat passengers.",
  },
  {
    title: "Do not use the phone while driving",
    description: "Even a quick glance away from the road can lead to a serious crash.",
  },
  {
    title: "Follow speed limits",
    description: "Overspeeding reduces reaction time and makes impact much more dangerous.",
  },
  {
    title: "Never drink and drive",
    description: "If you have consumed alcohol, do not drive. Use a cab or a designated driver.",
  },
  {
    title: "Keep safe distance",
    description: "Maintain enough gap from the vehicle ahead so you can brake in time.",
  },
  {
    title: "Wear a helmet on two-wheelers",
    description: "Both rider and pillion should wear a proper helmet every time.",
  },
];

const Challan = () => {
  const navigate = useNavigate();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [searchedVehicle, setSearchedVehicle] = useState("");

  const handleSearch = () => {
    setSearchedVehicle(vehicleNumber.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.09),_transparent_22%),linear-gradient(160deg,_#050816,_#10172c_52%,_#090f1a)] text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-5rem] top-24 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-12 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
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
            <h1 className="text-2xl font-semibold sm:text-3xl">Challan</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.3)] lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-300/80">Challan Module</p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              This page is ready in the app, but live challan data is not connected yet.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              We removed the demo records so the screen does not show fake data. Once your
              challan API is connected, this page can display real pending fines, payment
              status, and vehicle-specific records.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
              <p className="text-sm text-yellow-200">Module status</p>
              <p className="mt-1 text-2xl font-semibold">Ready</p>
            </div>
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-200">Data source</p>
              <p className="mt-1 text-2xl font-semibold">Not connected</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-4">
              <p className="text-sm text-slate-300">Fetched records</p>
              <p className="mt-1 text-2xl font-semibold">0</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-cyan-300" />
              <div>
                <h3 className="text-xl font-semibold">Search by Vehicle Number</h3>
                <p className="text-sm text-slate-400">
                  You can enter a vehicle number now, but no challan data is fetched yet.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3">
                <CarFront className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(event) => setVehicleNumber(event.target.value.toUpperCase())}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                  placeholder="Enter vehicle number, for example DL8CAF5031"
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300"
              >
                Search
              </button>
            </div>

            <div className="mt-4 rounded-[24px] border border-dashed border-white/15 bg-white/5 px-5 py-4">
              <p className="text-sm text-slate-300">
                {searchedVehicle
                  ? `No challan data is available for ${searchedVehicle} right now because live fetching is not connected yet.`
                  : "Search is ready, but the page will not return any challan data until the live API is connected."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-yellow-300" />
            <div>
              <h3 className="text-xl font-semibold">No Challan Data Yet</h3>
              <p className="text-sm text-slate-400">
                Live challan fetch has not been added yet, so no records are shown for now.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                Current State
              </div>
              <p className="mt-3 text-sm text-slate-300">
                The page is available and styled, but it is intentionally empty until a real API is connected.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-slate-300">
                <CarFront className="h-5 w-5 text-cyan-300" />
                Future Use
              </div>
              <p className="mt-3 text-sm text-slate-300">
                This can later show vehicle-based challan search, payment status, and violation history.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertTriangle className="h-5 w-5 text-yellow-300" />
                Note
              </div>
              <p className="mt-3 text-sm text-slate-300">
                No mock challans are shown now, so users do not confuse demo data with real fines.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
            <div>
              <h3 className="text-xl font-semibold">Major Road Safety Tips</h3>
              <p className="text-sm text-slate-400">
                A few important safety reminders to keep the page useful until live challan data is added.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ROAD_SAFETY_TIPS.map((tip) => (
              <div
                key={tip.title}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-emerald-300/35 hover:bg-white/[0.07]"
              >
                <h4 className="text-lg font-semibold">{tip.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{tip.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Challan;

import React, { useState } from "react";
import { ArrowLeft, Filter, Gauge, Fuel, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cars = [
 
  { name: "Tata Nexon", price: 915000, mileage: 22, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Hyundai Creta", price: 1500000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Maruti Brezza", price: 1100000, mileage: 25, fuel: "CNG", transmission: "Manual", body: "SUV" },
  { name: "Mahindra Scorpio N", price: 2100000, mileage: 15, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Maruti Swift", price: 800000, mileage: 28, fuel: "CNG", transmission: "Manual", body: "Hatchback" },
  { name: "Honda City", price: 1500000, mileage: 22, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Skoda Slavia", price: 1400000, mileage: 20, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Tata Harrier", price: 2000000, mileage: 18, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Mahindra XUV700", price: 2400000, mileage: 17, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Hyundai i20", price: 1000000, mileage: 22, fuel: "Petrol", transmission: "Automatic", body: "Hatchback" },

 
  { name: "Tata Punch", price: 700000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Tata Altroz", price: 850000, mileage: 21, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Tata Tigor", price: 750000, mileage: 22, fuel: "CNG", transmission: "Manual", body: "Sedan" },
  { name: "Tata Safari", price: 2200000, mileage: 16, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Hyundai Venue", price: 1200000, mileage: 19, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Hyundai Verna", price: 1600000, mileage: 21, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Hyundai Alcazar", price: 1900000, mileage: 17, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Maruti Baleno", price: 900000, mileage: 23, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Maruti Dzire", price: 850000, mileage: 24, fuel: "Petrol", transmission: "Manual", body: "Sedan" },
  { name: "Maruti Ertiga", price: 1200000, mileage: 20, fuel: "CNG", transmission: "Manual", body: "MPV" },
  { name: "Maruti XL6", price: 1400000, mileage: 19, fuel: "Petrol", transmission: "Automatic", body: "MPV" },

  { name: "Mahindra Bolero", price: 1100000, mileage: 16, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Mahindra Thar", price: 1600000, mileage: 15, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Mahindra Marazzo", price: 1500000, mileage: 17, fuel: "Diesel", transmission: "Manual", body: "MPV" },

  { name: "Honda Amaze", price: 900000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Honda WR-V", price: 1100000, mileage: 17, fuel: "Diesel", transmission: "Manual", body: "SUV" },

  { name: "Kia Seltos", price: 1600000, mileage: 17, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Kia Sonet", price: 1200000, mileage: 19, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Kia Carens", price: 1800000, mileage: 16, fuel: "Petrol", transmission: "Automatic", body: "MPV" },

  { name: "MG Hector", price: 1800000, mileage: 14, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "MG Astor", price: 1400000, mileage: 15, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "MG Gloster", price: 3400000, mileage: 12, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Toyota Fortuner", price: 3800000, mileage: 10, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Toyota Innova Hycross", price: 3000000, mileage: 21, fuel: "Hybrid", transmission: "Automatic", body: "MPV" },
  { name: "Toyota Glanza", price: 900000, mileage: 22, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Skoda Kushaq", price: 1500000, mileage: 17, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Skoda Octavia", price: 2800000, mileage: 15, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Volkswagen Virtus", price: 1600000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Volkswagen Taigun", price: 1500000, mileage: 17, fuel: "Petrol", transmission: "Automatic", body: "SUV" },



  { name: "Renault Kiger", price: 700000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Renault Triber", price: 650000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "MPV" },
  { name: "Renault Kwid", price: 500000, mileage: 22, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Nissan Magnite", price: 700000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Nissan Kicks", price: 1000000, mileage: 14, fuel: "Petrol", transmission: "Manual", body: "SUV" },

  { name: "Jeep Compass", price: 2200000, mileage: 14, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Jeep Meridian", price: 3500000, mileage: 14, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Citroen C3", price: 700000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Citroen C5 Aircross", price: 3100000, mileage: 16, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Volvo XC40", price: 4600000, mileage: 12, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Volvo XC60", price: 6500000, mileage: 11, fuel: "Hybrid", transmission: "Automatic", body: "SUV" },

  { name: "BMW X1", price: 4500000, mileage: 14, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "BMW X3", price: 6500000, mileage: 12, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Audi Q3", price: 4500000, mileage: 13, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Audi A4", price: 4500000, mileage: 14, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Mercedes GLA", price: 5000000, mileage: 13, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Mercedes C-Class", price: 5500000, mileage: 12, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  

  { name: "Tata Vista", price: 600000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Tata Manza", price: 700000, mileage: 18, fuel: "Diesel", transmission: "Manual", body: "Sedan" },
  { name: "Tata Sumo LX", price: 900000, mileage: 14, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Tata Hexa", price: 1700000, mileage: 15, fuel: "Diesel", transmission: "Manual", body: "MPV" },

  { name: "Hyundai Getz", price: 550000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Hyundai Tucson", price: 2800000, mileage: 15, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Maruti Celerio", price: 600000, mileage: 26, fuel: "CNG", transmission: "Manual", body: "Hatchback" },
  { name: "Maruti Alto K10", price: 500000, mileage: 24, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Maruti WagonR", price: 650000, mileage: 23, fuel: "CNG", transmission: "Manual", body: "Hatchback" },

  { name: "Mahindra Quanto", price: 900000, mileage: 17, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Mahindra KUV100", price: 700000, mileage: 18, fuel: "Petrol", transmission: "Manual", body: "SUV" },

  { name: "Honda Brio", price: 550000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Honda Jazz", price: 900000, mileage: 18, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Kia Carnival", price: 3000000, mileage: 14, fuel: "Diesel", transmission: "Automatic", body: "MPV" },

  { name: "MG Comet EV", price: 800000, mileage: 240, fuel: "Electric", transmission: "Automatic", body: "Hatchback" },

  { name: "Toyota Urban Cruiser", price: 1100000, mileage: 20, fuel: "Petrol", transmission: "Automatic", body: "SUV" },

  { name: "Skoda Rapid", price: 1000000, mileage: 17, fuel: "Petrol", transmission: "Manual", body: "Sedan" },

  { name: "Volkswagen Polo", price: 900000, mileage: 18, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },


  { name: "Tata UrbanX", price: 950000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Tata MetroPlus", price: 850000, mileage: 21, fuel: "CNG", transmission: "Manual", body: "Hatchback" },
  { name: "Tata Glide EV", price: 1200000, mileage: 300, fuel: "Electric", transmission: "Automatic", body: "Hatchback" },

  { name: "Hyundai Aero", price: 1300000, mileage: 19, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Hyundai StormX", price: 1700000, mileage: 18, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Maruti EcoRide", price: 700000, mileage: 24, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Maruti Omni Neo", price: 600000, mileage: 22, fuel: "Petrol", transmission: "Manual", body: "Van" },

  { name: "Mahindra TrailMaster", price: 1800000, mileage: 14, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Mahindra Ranger X", price: 1600000, mileage: 15, fuel: "Petrol", transmission: "Manual", body: "SUV" },

  { name: "Honda NeoDrive", price: 1200000, mileage: 20, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Honda AeroPlus", price: 1400000, mileage: 21, fuel: "Hybrid", transmission: "Automatic", body: "Sedan" },

  { name: "Kia MicroSUV", price: 900000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Kia UrbanWave", price: 1300000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" },

  { name: "MG Flexi", price: 1100000, mileage: 16, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Toyota Compacto", price: 1000000, mileage: 20, fuel: "CNG", transmission: "Manual", body: "Hatchback" },

  { name: "Skoda AeroX", price: 1600000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" },

  { name: "Volkswagen MiniCross", price: 1000000, mileage: 18, fuel: "Petrol", transmission: "Manual", body: "SUV" },

  

  { name: "Tata Roadster", price: 1300000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Tata Bolt EV", price: 1400000, mileage: 340, fuel: "Electric", transmission: "Automatic", body: "Hatchback" },
  { name: "Tata MaxRide", price: 1100000, mileage: 19, fuel: "Diesel", transmission: "Manual", body: "SUV" },

  { name: "Hyundai Flow", price: 1200000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Hyundai GrandX", price: 1600000, mileage: 17, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Maruti ZenX", price: 700000, mileage: 23, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Maruti RapidVan", price: 650000, mileage: 22, fuel: "Petrol", transmission: "Manual", body: "Van" },

  { name: "Mahindra BeatMaster", price: 1500000, mileage: 16, fuel: "Diesel", transmission: "Manual", body: "SUV" },

  { name: "Honda GlideX", price: 1300000, mileage: 20, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Kia MiniCruise", price: 1000000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "MPV" },

  { name: "MG AeroDrive", price: 1200000, mileage: 17, fuel: "Petrol", transmission: "Manual", body: "Sedan" },

  { name: "Toyota Speedo", price: 1100000, mileage: 21, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Skoda Zoom", price: 1250000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Volkswagen Xline", price: 1400000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "SUV" },

 
  { name: "Tata UrbanJet", price: 1050000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Tata Elevate", price: 1350000, mileage: 20, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Hyundai MiniStar", price: 850000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Maruti Speedster", price: 800000, mileage: 24, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Mahindra XUV300 Lite", price: 1000000, mileage: 17, fuel: "Diesel", transmission: "Manual", body: "SUV" },

  { name: "Honda AeroCompact", price: 1150000, mileage: 20, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Kia NeoX", price: 1100000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" },

  { name: "MG MicroSUV", price: 950000, mileage: 17, fuel: "Petrol", transmission: "Manual", body: "SUV" },

  { name: "Toyota MiniCruiser", price: 1000000, mileage: 20, fuel: "CNG", transmission: "Manual", body: "SUV" },

  { name: "Skoda NeoDrive", price: 1500000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Volkswagen RapidX", price: 1300000, mileage: 17, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  

  { name: "Tata Flexo", price: 900000, mileage: 21, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Tata CruiserX", price: 1400000, mileage: 19, fuel: "Diesel", transmission: "Manual", body: "SUV" },

  { name: "Hyundai Evo", price: 1200000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },

  { name: "Maruti MegaRide", price: 950000, mileage: 23, fuel: "CNG", transmission: "Manual", body: "Hatchback" },

  { name: "Mahindra Titan", price: 1800000, mileage: 16, fuel: "Diesel", transmission: "Automatic", body: "SUV" },

  { name: "Honda City Neo", price: 1600000, mileage: 20, fuel: "Hybrid", transmission: "Automatic", body: "Sedan" },

  { name: "Kia CompactX", price: 950000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "MG TrailX", price: 1300000, mileage: 17, fuel: "Diesel", transmission: "Manual", body: "SUV" },

  { name: "Toyota UrbanX", price: 1200000, mileage: 19, fuel: "Petrol", transmission: "Automatic", body: "SUV" },

  { name: "Skoda JetLine", price: 1600000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" },

  { name: "Volkswagen VentoX", price: 1500000, mileage: 17, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },


  { name: "Tata SkyDrive", price: 1100000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "SUV" },
  { name: "Hyundai Horizon", price: 1500000, mileage: 18, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Maruti Zipster", price: 850000, mileage: 26, fuel: "CNG", transmission: "Manual", body: "Hatchback" },
  { name: "Mahindra BoltX", price: 1650000, mileage: 16, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Honda CruiseX", price: 1300000, mileage: 21, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Kia DriftX", price: 1350000, mileage: 19, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "MG NeoHatch", price: 1000000, mileage: 18, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Toyota SwiftRide", price: 1100000, mileage: 20, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Skoda FlexDrive", price: 1550000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Volkswagen StreetX", price: 1400000, mileage: 17, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },

  { name: "Tata GlideX", price: 1000000, mileage: 21, fuel: "Petrol", transmission: "Manual", body: "Sedan" },
  { name: "Hyundai CompactDrive", price: 1100000, mileage: 19, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "Maruti EcoPlus", price: 900000, mileage: 25, fuel: "CNG", transmission: "Manual", body: "Hatchback" },
  { name: "Mahindra UrbanDrive", price: 1500000, mileage: 17, fuel: "Diesel", transmission: "Manual", body: "SUV" },
  { name: "Honda PrimeX", price: 1400000, mileage: 20, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Kia SportLine", price: 1500000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" },
  { name: "MG Compacto", price: 950000, mileage: 19, fuel: "Petrol", transmission: "Manual", body: "Hatchback" },
  { name: "Toyota RoadMaster", price: 1800000, mileage: 18, fuel: "Diesel", transmission: "Automatic", body: "SUV" },
  { name: "Skoda EliteX", price: 1600000, mileage: 17, fuel: "Petrol", transmission: "Automatic", body: "Sedan" },
  { name: "Volkswagen UrbanJet", price: 1500000, mileage: 18, fuel: "Petrol", transmission: "Automatic", body: "SUV" }


];

const Features = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    fuel: "",
    transmission: "",
    body: "",
    budget: "",
  });

  const [results, setResults] = useState([]);

  const handleSearch = () => {
    let filtered = [...cars];

    if (filters.fuel) filtered = filtered.filter((car) => car.fuel === filters.fuel);
    if (filters.transmission) filtered = filtered.filter((car) => car.transmission === filters.transmission);
    if (filters.body) filtered = filtered.filter((car) => car.body === filters.body);
    if (filters.budget) filtered = filtered.filter((car) => car.price <= parseInt(filters.budget));

    if (!filters.fuel && !filters.transmission && !filters.body && !filters.budget) filtered = cars;

    setResults(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 p-5 bg-black/60 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <ArrowLeft onClick={() => navigate("/home")} className="cursor-pointer hover:text-yellow-400 transition" />
        <h2 className="text-2xl font-bold tracking-wide">Car Feature Finder</h2>
      </header>

      {/* Filter Section */}
      <div className="max-w-3xl mx-auto mt-8 bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-700/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={22} className="text-yellow-400" />
          <h3 className="text-xl font-semibold">Select Your Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-400" 
            onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}>
            <option value="">Fuel Type</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>CNG</option>
          </select>

          <select className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}>
            <option value="">Transmission</option>
            <option>Manual</option>
            <option>Automatic</option>
          </select>

          <select className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setFilters({ ...filters, body: e.target.value })}>
            <option value="">Body Type</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
          </select>

          <input type="number"
            placeholder="Max Budget (₹)"
            className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full text-center mt-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-transform hover:scale-[1.02]"
        >
          Show Cars
        </button>
      </div>

      {/* Result Section */}
      <div className="max-w-5xl mx-auto mt-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {results.length > 0 ? 
          results.map((car, idx) => (
            <div key={idx} className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 shadow-md hover:shadow-yellow-400/10 transition hover:scale-[1.02]">
              <h3 className="text-lg font-bold mb-2">{car.name}</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>💰 Price: <span className="text-yellow-400 font-medium">₹{car.price.toLocaleString()}</span></p>
                <p><Fuel size={14} className="inline mr-2" />Fuel: {car.fuel}</p>
                <p>⚙ Transmission: {car.transmission}</p>
                <p><Car size={14} className="inline mr-2" />Body: {car.body}</p>
                <p><Gauge size={14} className="inline mr-2" />Mileage: {car.mileage} kmpl</p>
              </div>
            </div>
          ))
        : (
          <p className="text-gray-400 text-center col-span-full text-lg">
            👀 Filter options above to view matching cars.
          </p>
        )}
      </div>

    </div>
  );
};

export default Features;

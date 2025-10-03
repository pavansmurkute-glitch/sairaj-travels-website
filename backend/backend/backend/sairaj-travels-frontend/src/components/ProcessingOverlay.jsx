import React, { useState, useEffect } from "react";

export default function ProcessingOverlay() {
  const [roadSpeed, setRoadSpeed] = useState("animate-roadMove"); // start slow

  useEffect(() => {
    // Sync with bus animation cycle (5s total)
    const cycle = setInterval(() => {
      setRoadSpeed("animate-roadMove fast"); // speed up when bus moves
      setTimeout(() => setRoadSpeed("animate-roadMove"), 2500); // slow when bus returns
    }, 5000);

    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30">
      {/* Road */}
      <div className="relative w-96 h-24 bg-gray-800 rounded-lg overflow-hidden flex items-center animate-roadShake">
        {/* Road Lines (speed controlled by state) */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 flex">
          <div className={`road-lines ${roadSpeed}`}></div>
        </div>

        {/* Bus */}
        <img
          src="/bus.png" // ✅ from public folder
          alt="Bus"
          className="absolute h-23 md:h-25 animate-busTiltBounce"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        />
      </div>

      {/* Text */}
      <p className="mt-4 text-gray-800 font-semibold text-lg animate-pulse">
        Processing your request...
      </p>
    </div>
  );
}

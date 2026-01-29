import { useContext } from "react";
import { ParkingContext } from "@/context/ParkingContext";

/**
 * Custom hook to use Parking Context
 * @returns {object} Parking context value
 */
export const useParkingData = () => {
  const context = useContext(ParkingContext);

  if (!context) {
    throw new Error("useParkingData must be used within a ParkingProvider");
  }

  return context;
};

export default useParkingData;

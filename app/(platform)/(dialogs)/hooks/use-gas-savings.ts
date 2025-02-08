import { useState, useEffect, useCallback } from "react";

interface Vehicle {
  mpg: string;
}

interface CalcResult {
  annualGallons: number;
  annualCost: number;
  monthlyCost: number;
  savings: 'A' | 'B';
}

export function useGasSavings() {
  const [annualMiles, setAnnualMiles] = useState("12000");
  const [gasPrice, setGasPrice] = useState("3.50");
  const [vehicleA, setVehicleA] = useState<Vehicle>({ mpg: "" });
  const [vehicleB, setVehicleB] = useState<Vehicle>({ mpg: "" });
  const [result, setResult] = useState<CalcResult | null>(null);

  const calculateSavings = useCallback(() => {
    const miles = parseFloat(annualMiles);
    const mpgA = parseFloat(vehicleA.mpg);
    const mpgB = parseFloat(vehicleB.mpg);
    const price = parseFloat(gasPrice);

    if (!miles || !mpgA || !mpgB || !price) {
      setResult(null);
      return;
    }

    const annualGallonsA = miles / mpgA;
    const annualGallonsB = miles / mpgB;
    const annualCostA = annualGallonsA * price;
    const annualCostB = annualGallonsB * price;
    const annualSavings = Math.abs(annualCostA - annualCostB);

    setResult({
      annualGallons: Math.abs(annualGallonsA - annualGallonsB),
      annualCost: annualSavings,
      monthlyCost: annualSavings / 12,
      savings: annualCostA > annualCostB ? 'B' : 'A',
    });
  }, [annualMiles, gasPrice, vehicleA.mpg, vehicleB.mpg]);

  useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  return {
    annualMiles,
    setAnnualMiles,
    gasPrice,
    setGasPrice,
    vehicleA,
    setVehicleA,
    vehicleB,
    setVehicleB,
    result,
  };
} 
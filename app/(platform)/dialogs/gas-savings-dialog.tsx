"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Car,
  DollarSign,
  Fuel,
  RouteIcon as Road,
  Calculator,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";

interface CalcResult {
  annualGallons: number;
  annualCost: number;
  monthlyCost: number;
  savings: number;
}

interface GasSavingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GasSavingsDialog({
  open,
  onOpenChange,
}: GasSavingsDialogProps) {
  const [annualMiles, setAnnualMiles] = useState("12000");
  const [gasPrice, setGasPrice] = useState("3.50");
  const [vehicle1, setVehicle1] = useState({ mpg: "" });
  const [vehicle2, setVehicle2] = useState({ mpg: "" });
  const [result, setResult] = useState<CalcResult | null>(null);

  const calculateSavings = useCallback(() => {
    const miles = parseFloat(annualMiles);
    const mpg1 = parseFloat(vehicle1.mpg);
    const mpg2 = parseFloat(vehicle2.mpg);
    const price = parseFloat(gasPrice);

    if (!miles || !mpg1 || !mpg2 || !price) {
      setResult(null);
      return;
    }

    const annualGallons1 = miles / mpg1;
    const annualGallons2 = miles / mpg2;
    const annualCost1 = annualGallons1 * price;
    const annualCost2 = annualGallons2 * price;
    const annualSavings = Math.abs(annualCost1 - annualCost2);

    setResult({
      annualGallons: Math.abs(annualGallons1 - annualGallons2),
      annualCost: annualSavings,
      monthlyCost: annualSavings / 12,
      savings: annualCost1 > annualCost2 ? 2 : 1,
    });
  }, [annualMiles, gasPrice, vehicle1.mpg, vehicle2.mpg]);

  useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Gas Savings Calculator</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Gas Savings Calculator
          </DialogTitle>
          <DialogDescription>
            Compare annual fuel costs between two vehicles.
          </DialogDescription>
        </DialogHeader>
        <Card className="w-full">
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-3">
                <Label
                  htmlFor="annual-miles"
                  className="flex items-center gap-2"
                >
                  <Road className="h-4 w-4" />
                  Annual Miles
                </Label>
                <Input
                  id="annual-miles"
                  type="number"
                  placeholder="12000"
                  value={annualMiles}
                  onChange={(e) => setAnnualMiles(e.target.value)}
                  className="p-3"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="gas-price" className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  Gas Price per Gallon
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="gas-price"
                    type="number"
                    step="0.01"
                    style={{ paddingLeft: "2rem" }}
                    className="p-3"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Vehicle 1</h3>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="v1-mpg">MPG</Label>
                  <Input
                    id="v1-mpg"
                    type="number"
                    placeholder="25"
                    value={vehicle1.mpg}
                    onChange={(e) =>
                      setVehicle1({ ...vehicle1, mpg: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Vehicle 2</h3>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="v2-mpg">MPG</Label>
                  <Input
                    id="v2-mpg"
                    type="number"
                    placeholder="25"
                    value={vehicle2.mpg}
                    onChange={(e) =>
                      setVehicle2({ ...vehicle2, mpg: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid gap-6">
              {result ? (
                <>
                  <div className="grid gap-4 text-center">
                    <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                      Vehicle {result.savings} saves you $
                      {result.monthlyCost.toFixed(2)} per month
                    </h3>
                    <div className="space-y-2">
                      <p className="text-lg text-emerald-600 dark:text-emerald-400">
                        That&apos;s ${result.annualCost.toFixed(2)} per year
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400">
                        {result.annualGallons.toFixed(1)} gallons of gas saved
                        annually!
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Enter vehicle details above to see potential savings
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

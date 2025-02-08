"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useGasSavings } from "./hooks/use-gas-savings";
import { cn } from "@/lib/utils";

interface GasSavingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add this interface for the icon prop type
interface IconType {
  // Lucide icon properties
  className?: string;
}

function InputWithLabel({
  label,
  icon: Icon,
  id,
  value,
  onChange,
  description,
  placeholder,
  type = "number",
  startIcon,
  step,
}: {
  label: string;
  icon: React.ComponentType<IconType>;
  id: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  type?: string;
  startIcon?: React.ReactNode;
  step?: string;
}) {
  return (
    <div className="grid gap-3">
      <div className="space-y-1">
        <Label htmlFor={id} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="relative">
        {startIcon}
        <Input
          id={id}
          type={type}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("p-3", startIcon && "pl-8")}
        />
      </div>
    </div>
  );
}

export function GasSavingsDialog({ open, onOpenChange }: GasSavingsDialogProps) {
  const {
    annualMiles,
    setAnnualMiles,
    gasPrice,
    setGasPrice,
    vehicleA,
    setVehicleA,
    vehicleB,
    setVehicleB,
    result,
  } = useGasSavings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="h-6 w-6" />
            Gas Savings Calculator
          </DialogTitle>
          <DialogDescription className="text-base">
            Compare annual fuel costs between two vehicles to see potential savings.
          </DialogDescription>
        </DialogHeader>

        <Card className="w-full border-2">
          <CardContent className="grid gap-8 p-6">
            {/* Input Section */}
            <div className="grid gap-6 sm:grid-cols-2">
              <InputWithLabel
                label="Annual Miles"
                icon={Road}
                id="annual-miles"
                value={annualMiles}
                onChange={setAnnualMiles}
                placeholder="12000"
                description="How many miles do you drive a year?"
              />
              
              <InputWithLabel
                label="Gas Price per Gallon"
                icon={Fuel}
                id="gas-price"
                value={gasPrice}
                onChange={setGasPrice}
                placeholder="3.50"
                step="0.01"
                startIcon={
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                }
                description="How much does a gallon of gas for this car cost?"
              />
            </div>

            {/* Vehicle Comparison Section */}
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { letter: 'A', data: vehicleA, setData:  setVehicleA },
                { letter: 'B', data: vehicleB, setData: setVehicleB },
              ].map((vehicle) => (
                <Card key={vehicle.letter} className="border-2">
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">
                        Vehicle {vehicle.letter}
                      </h3>
                    </div>
                    <InputWithLabel
                      label="Miles Per Gallon (MPG)"
                      icon={Fuel}
                      id={`v${vehicle.letter}-mpg`}
                      value={vehicle.data.mpg}
                      onChange={(value) =>
                        vehicle.setData({ ...vehicle.data, mpg: value })
                      }
                      placeholder="Enter MPG"
                      description="How many miles per gallon does the vehicle get?"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-2" />

            {/* Results Section */}
            <div className="rounded-lg bg-muted/50 p-6">
              {result ? (
                <div className="grid gap-4 text-center">
                  <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                    Vehicle {result.savings} saves you{" "}
                    <span className="text-4xl">
                      ${result.monthlyCost.toFixed(2)}
                    </span>{" "}
                    per month!
                  </h3>
                  <div className="space-y-2">
                    <p className="text-lg text-emerald-600 dark:text-emerald-400">
                      Annual savings: ${result.annualCost.toFixed(2)}
                    </p>
                    <p className="text-emerald-600/90 dark:text-emerald-400/90">
                      You&apos;ll save {result.annualGallons.toFixed(1)} gallons of gas
                      per year!
                    </p>
                  </div>
                </div>
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

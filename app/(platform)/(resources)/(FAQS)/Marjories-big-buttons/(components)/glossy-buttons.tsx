"use client";

import "../fonts.css";
import { useRef, useCallback } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GlossyButtons() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [showHappyHour, setShowHappyHour] = useState(false);
  const [happyHourDate, setHappyHourDate] = useState("");

  const playRandomSegment = useCallback(() => {
    if (!audioRef.current || !buttonSoundRef.current) return;

    const audio = audioRef.current;
    const buttonSound = buttonSoundRef.current;
    const duration = audio.duration;
    const randomStart = Math.random() * (duration - 6);

    // Play both sounds
    audio.currentTime = randomStart;
    buttonSound.currentTime = 0;
    audio.play();
    buttonSound.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 6000);
  }, []);

  const generateHappyHourDate = () => {
    // Get current date
    const now = new Date();

    // Generate a random date within next 30 days
    let futureDate;
    do {
      const randomDays = Math.floor(Math.random() * 30) + 1;
      futureDate = new Date(now.getTime()); // Create new date object to avoid modifying original
      futureDate.setDate(futureDate.getDate() + randomDays);
    } while (futureDate.getDay() === 0 || futureDate.getDay() === 6); // Repeat if weekend (0 = Sunday, 6 = Saturday)

    // Set random time between 4-6 PM
    const randomHour = Math.floor(Math.random() * 2) + 16; // 16 = 4 PM, 17 = 5 PM
    const randomMinute = Math.floor(Math.random() * 4) * 15; // Random quarter hour: 0, 15, 30, or 45
    futureDate.setHours(randomHour, randomMinute, 0);

    // Format the date
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return futureDate.toLocaleDateString("en-US", options);
  };

  const openHappyHourDialog = () => {
    setHappyHourDate(generateHappyHourDate());
    setShowHappyHour(true);
  };

  const generateQuote = async () => {
    if (isGeneratingQuote) return;
    setIsGeneratingQuote(true);

    try {
      const response = await fetch("/api/generate-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quote");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `InspiringQuote.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating quote:", error);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const generateCountryFacts = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-country-facts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to generate facts");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `CountryFacts.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating facts:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <audio ref={audioRef} src="/toySound.m4a" preload="auto" />
      <audio ref={buttonSoundRef} src="/buttonSound.wav" preload="auto" />
      <h1 className="font-['ToysRUs'] text-6xl mb-24 text-[#0066b2] transform -rotate-6">
        Marjorie&apos;s Buttons
      </h1>
      <div className="flex gap-8">
        {/* Blue Button */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black translate-y-3" />
          <button
            onClick={async (e) => {
              e.preventDefault();
              playRandomSegment();
              await generateQuote();
            }}
            className="relative w-32 h-32 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 
            shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.2)]
            hover:shadow-[inset_0_-6px_0_0_rgba(0,0,0,0.2)]
            active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]
            active:transform active:translate-y-2
            transition-all duration-150
            before:absolute before:inset-4 before:rounded-full
            before:bg-gradient-to-b before:from-white/30 before:to-transparent"
            aria-label="Blue button"
          />
          {/* Loading bar */}
          {isGeneratingQuote && (
            <div className="absolute -bottom-8 left-0 w-full h-2 rounded-full bg-blue-200 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"
                style={{ width: "30%" }}
              />
            </div>
          )}
        </div>

        {/* Orange Button */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black translate-y-3" />
          <button
            onClick={async (e) => {
              e.preventDefault();
              playRandomSegment();
              await generateCountryFacts();
            }}
            className="relative w-32 h-32 rounded-full bg-gradient-to-b from-orange-400 to-orange-600
            shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.2)]
            hover:shadow-[inset_0_-6px_0_0_rgba(0,0,0,0.2)]
            active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]
            active:transform active:translate-y-2
            transition-all duration-150
            before:absolute before:inset-4 before:rounded-full
            before:bg-gradient-to-b before:from-white/30 before:to-transparent"
            aria-label="Orange button"
          />
          {/* Loading bar */}
          {isGenerating && (
            <div className="absolute -bottom-8 left-0 w-full h-2 rounded-full bg-orange-200 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"
                style={{ width: "30%" }}
              />
            </div>
          )}
        </div>

        {/* Green Button */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black translate-y-3" />
          <button
            onClick={(e) => {
              e.preventDefault();
              playRandomSegment();
              window.open("https://www.amazon.com/deals", "_blank");
            }}
            className="relative w-32 h-32 rounded-full bg-gradient-to-b from-green-400 to-green-600
            shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.2)]
            hover:shadow-[inset_0_-6px_0_0_rgba(0,0,0,0.2)]
            active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]
            active:transform active:translate-y-2
            transition-all duration-150
            before:absolute before:inset-4 before:rounded-full
            before:bg-gradient-to-b before:from-white/30 before:to-transparent"
            aria-label="Green button"
          />
        </div>

        {/* Pink Button */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black translate-y-3" />
          <button
            onClick={(e) => {
              e.preventDefault();
              playRandomSegment();
              openHappyHourDialog();
            }}
            className="relative w-32 h-32 rounded-full bg-gradient-to-b from-pink-400 to-pink-600
            shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.2)]
            hover:shadow-[inset_0_-6px_0_0_rgba(0,0,0,0.2)]
            active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]
            active:transform active:translate-y-2
            transition-all duration-150
            before:absolute before:inset-4 before:rounded-full
            before:bg-gradient-to-b before:from-white/30 before:to-transparent"
            aria-label="Pink button"
          />
        </div>
      </div>

      {/* Happy Hour Dialog */}
      <Dialog open={showHappyHour} onOpenChange={setShowHappyHour}>
        <DialogContent className="sm:max-w-[465px]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-['ToysRUs'] text-[#0066b2] transform -rotate-3 mb-4">
              Next Happy Hour! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-['ToysRUs'] text-[#0066b2] mb-2">
                Suggested Date:
              </h3>
              <p className="text-gray-700 text-lg">{happyHourDate}</p>
            </div>
            <div>
              <h3 className="text-xl font-['ToysRUs'] text-[#0066b2] mb-2">
                Suggested Snacks:
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-lg">
                <li>Assorted Cheese Platter</li>
                <li>Crackers and Dips</li>
                <li>Fresh Strawberries</li>
                <li>Chocolate Cake</li>
                <li>Potato Chips</li>
                <li>Mixed Nuts</li>
                <li>Veggie Platter</li>
                <li>Cookies</li>
              </ul>
            </div>
            <p className="text-center italic text-gray-500 mt-6">
              Press the big pink button again to choose a different date!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

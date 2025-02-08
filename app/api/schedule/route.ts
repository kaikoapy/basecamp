// File: /app/api/schedule/route.ts

import { NextResponse } from "next/server";
import { generateMonthlySchedule, DaySchedule, Employee, Weekday } from "@/app/(platform)/schedule/lib/scheduling";

// In a real app, you might load this from a database.
const employees: Employee[] = [
  { name: "Ron", fixedOffDay: Weekday.Tuesday, sundaySchedule: true },
  { name: "Moudy", fixedOffDay: Weekday.Tuesday, sundaySchedule: false },
  { name: "Juan", fixedOffDay: Weekday.Wednesday, sundaySchedule: true },
  { name: "Amr", fixedOffDay: Weekday.Wednesday, sundaySchedule: false },
  { name: "Steven", fixedOffDay: Weekday.Thursday, sundaySchedule: true },
  { name: "Alex", fixedOffDay: Weekday.Monday, sundaySchedule: false },
  { name: "Gabriel", fixedOffDay: Weekday.Thursday, sundaySchedule: true },
  { name: "Gio", fixedOffDay: Weekday.Friday, sundaySchedule: false },
  { name: "Tito", fixedOffDay: Weekday.Friday, sundaySchedule: true },
];

export async function GET(request: Request) {
  // Extract query parameters from the URL.
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  // Convert parameters to numbers.
  const year = Number(yearParam);
  const month = Number(monthParam);

  // Validate the input.
  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
    return NextResponse.json({ error: "Invalid year or month provided." }, { status: 400 });
  }

  try {
    // Generate the schedule using your scheduling logic.
    const schedule: DaySchedule[] = generateMonthlySchedule(year, month, employees).schedule;
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error generating schedule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Remove any timestamp, "special:" prefix, or salesperson type ("new:" or "used:")
// and return only the first name for salespeople, but keep full text for special labels
export function parseName(item: string): string {
  let name = item;
  if (name.includes("::")) {
    name = name.split("::")[0];
  }
  
  // If it's a special label, just remove the prefix and return the full text
  if (name.startsWith("special:")) {
    return name.substring("special:".length);
  }
  
  // For salespeople, remove the type prefix and return only first name
  if (name.startsWith("new:")) {
    name = name.substring("new:".length);
  }
  if (name.startsWith("used:")) {
    name = name.substring("used:".length);
  }
  // Get only the first name for salespeople
  return name.split(" ")[0];
}

// Default shifts to use while loading or if database is empty
export const defaultShifts = {
  monday: ["8:30-5:30", "9:00-6:00", "11:00-8:00", "Off"],
  tuesday: ["8:30-5:30", "9:00-6:00", "11:00-8:00", "Off"],
  wednesday: ["8:30-5:30", "9:00-6:00", "11:00-8:00", "Off"],
  thursday: ["8:30-5:30", "9:00-6:00", "11:00-8:00", "Off"],
  friday: ["8:30-5:30", "9:00-6:00", "11:00-7:00", "Off"],
  saturday: ["8:30-5:30", "9:00-6:00", "11:00-7:00", "Off"],
  sunday: ["12:00-5:00", "Off"],
};

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export const defaultSpecialLabels = ["Month End", "Closed"] as const; 
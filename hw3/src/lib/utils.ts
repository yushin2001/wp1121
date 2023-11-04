import { faker } from "@faker-js/faker";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// this utility function is used to merge tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// generate a random avatar for a user
export function getAvatar(username?: string | null) {
  faker.seed(username ? getSeed(username) : 42069);
  return faker.internet.avatar();
}

// convert username to a number for consistent seeding
function getSeed(username: string) {
  const code = new TextEncoder().encode(username);
  return Array.from(code).reduce(
    (acc, curr, i) => (acc + curr * i) % 1_000_000,
    0,
  );
}

export function validateHandle(handle?: string | null) {
  if (!handle) return false;
  return /^[a-z0-9\\._-]{1,25}$/.test(handle);
}

export function validateUsername(username?: string | null) {
  if (!username) return false;
  return /^[a-zA-Z0-9 ]{1,50}$/.test(username);
}

export function validateName(name?: string | null) {
  if (!name) return false;
  return true;
}

export function validatestartTime(startTime?: string | null) {
  if (!startTime) return false;
  else{
    const error = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9])$/.test(startTime);
    if (!error) return false;
    const dateObject = new Date(startTime+":00");
    if (!isNaN(dateObject.getTime())) {
      return true;
    }
  }
}

export function validatedueTime(dueTime?: string | null) {
  if (!dueTime) return false;
  else{
    const error = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9])$/.test(dueTime);
    if (!error) return false;
    const dateObject = new Date(dueTime+":00");
    if (!isNaN(dateObject.getTime())) {
      return true;
    }
  }
}

function getDayDiff(startDate: Date, endDate: Date): number {
  const msInDay = 24 * 60 * 60 * 1000;
  const diff = Number(endDate) - Number(startDate);
  const diff_day = diff / msInDay;
  return(diff_day);
}

export function validateTime(StartTime?: string | null, DueTime?: string | null){
  const start = new Date(StartTime+":00");
  const due = new Date(DueTime+":00");
  const difference = getDayDiff(start, due);
  const too_large_check = (difference > 7);
  const later_check = (difference <= 0);
  if (too_large_check || later_check) return false;
  else return true;
}
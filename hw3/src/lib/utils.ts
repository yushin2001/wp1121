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


// 確認「新增活動」
export function validateName(name?: string | null) {
  if (!name) return false;
  return true;
}
export function validatestartTime(startTime?: string | null) {
  if (!startTime) return false;
  return /^[a-zA-Z0-9 ]{1,50}$/.test(startTime);
}
export function validatedueTime(dueTime?: string | null) {
  if (!dueTime) return false;
  return /^[a-zA-Z0-9 ]{1,50}$/.test(dueTime);
}
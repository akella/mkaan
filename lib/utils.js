import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function cx(...inputs) {
  return clsx(inputs)
}

export function reverseCubicBezier(bezier) {
  const points = bezier.split(",").map((num) => parseFloat(num.trim()))
  if (points.length !== 4) {
    throw new Error(
      "Invalid cubic-bezier format. Expected format: 'x1, y1, x2, y2'"
    )
  }

  const [x1, y1, x2, y2] = points
  const reversedPoints = [
    Math.round((1 - x2) * 100) / 100,
    Math.round((1 - y2) * 100) / 100,
    Math.round((1 - x1) * 100) / 100,
    Math.round((1 - y1) * 100) / 100,
  ]

  return reversedPoints.join(", ")
}

export const headingEase = '0.215, 0.61, 0.355, 1'
export const paragraphEase = '0.23, 1, 0.32, 1'


import { twMerge } from 'tailwind-merge'
import clsx, { ClassValue } from 'clsx'
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(...classes))
}

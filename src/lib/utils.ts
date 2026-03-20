import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ'
}

export function discount(price: number, original: number) {
  return Math.round(((original - price) / original) * 100)
}

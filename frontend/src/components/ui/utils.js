import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for joining class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

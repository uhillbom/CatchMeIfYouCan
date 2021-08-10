import { writable } from 'svelte/store';

export const numClicks = writable(0);
export const helpNeeded = writable(0);
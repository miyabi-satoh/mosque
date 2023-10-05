import { writable } from 'svelte/store';

export const loadingStore = writable(false);
export const submittingStore = writable(false);
export const innerScrollStore = writable(false);

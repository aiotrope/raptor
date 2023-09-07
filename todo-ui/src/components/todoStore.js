import { writable } from 'svelte/store';

let todoItems = writable([]);

export { todoItems };

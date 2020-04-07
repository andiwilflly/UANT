import { writable } from 'svelte/store';
// Stores
import { user } from "./user.store";


function createStore() {
    const { subscribe, set, update } = writable({
        a: 0
    });

    return {
        subscribe,
        increment: ()=> update(n => ({ a: 421 })),
        decrement: ()=> update(n => ({ a: 111 })),
        reset: ()=> set({ a: 0 })
    };
}

export const store = createStore();
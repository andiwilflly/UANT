import { writable } from 'svelte/store';


function User() {
    const { subscribe, set, update } = writable(null);

    return {
        subscribe,
        update: (changes= {})=> update(user => ({ ...user, ...changes }))
    };
}

export const user = User();
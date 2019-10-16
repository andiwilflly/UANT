import { writable } from 'svelte/store';


function User() {
    const { subscribe, set, update } = writable(null);

    return {
        subscribe,
        signIn: (changes= {})=> update(user => changes),
        signOut: ()=> update(user => null)
    };
}

export const user = User();
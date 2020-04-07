import { writable } from 'svelte/store';


function Players() {
    const { subscribe, set, update } = writable({
        all: [],
        offers: [],
        selected: null
    });

    return {
        subscribe,
        clearAll: ()=> update(players => ({
            all: [],
            offers: [],
            selected: null
        })),
        add: (player= {})=> update(players => ({
            all: [...players.all, player],
            offers: players.offers,
            selected: players.selected
        })),
        delete: (firebaseId)=>  update(players => ({
            all: players.all.filter(player => player.firebaseId !== firebaseId),
            offers: players.offers,
            selected: players.selected
        })),
        select: (playerId)=> update(players => ({
            all: players.all,
            offers: players.offers,
            selected: playerId
        })),
        updatePlayer: (changes= {})=> update(players => ({
            all: players.all.map(player => player.firebaseId === changes.firebaseId ? { ...player, ...changes } : player),
            offers: players.offers,
            selected: players.selected,
        })),

        addOffer: (player= {})=> update(players => ({
            all: players.all,
            offers: [...players.offers, player],
            selected: players.selected
        })),
        deleteOffer: (firebaseId)=>  update(players => ({
            all: players.all,
            offers: players.offers.filter(player => player.firebaseId !== firebaseId),
            selected: players.selected
        })),
    };
}

export default Players();
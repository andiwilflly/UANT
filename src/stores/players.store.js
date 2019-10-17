import { writable } from 'svelte/store';


function Players() {
    const { subscribe, set, update } = writable({
        all: [],
        selected: null
    });

    return {
        subscribe,
        add: (player= {})=> update(players => ({
            all: [...players.all, player],
            selected: players.selected
        })),
        delete: (firebaseId)=>  update(players => ({
            all: players.all.filter(player => player.firebaseId !== firebaseId),
            selected: players.selected
        })),
        select: (playerId)=> update(players => ({
            all: players.all,
            selected: playerId
        })),
        updatePlayer: (changes= {})=> update(players => ({
            all: players.all.map(player => player.firebaseId === changes.firebaseId ? { ...player, ...changes } : player),
            selected: players.selected,
        }))
    };
}

export default Players();
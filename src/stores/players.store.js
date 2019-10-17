import { writable } from 'svelte/store';


function Players() {
    const { subscribe, set, update } = writable({
        all: [],
        selected: null,
        skills: {
            'stamina': 'витривалість',
            'keeper': 'воротарство',
            'pace': 'швидкість',
            'defender': 'захист',
            'technique': 'техніка',
            'playmaker': 'півзахист',
            'passing': 'пас',
            'striker': 'напад'
        }
    });

    return {
        subscribe,
        add: (player= {})=> update(players => ({
            all: [...players.all, player],
            selected: players.selected,
            skills: players.skills
        })),
        delete: (firebaseId)=>  update(players => ({
            all: players.all.filter(player => player.firebaseId !== firebaseId),
            selected: players.selected
        })),
        select: (playerId)=> update(players => ({
            all: players.all,
            selected: playerId,
            skills: players.skills
        })),
        updatePlayer: (changes= {})=> update(players => ({
            all: players.all.map(player => player.firebaseId === changes.firebaseId ? { ...player, ...changes } : player),
            selected: players.selected,
            skills: players.skills
        }))
    };
}

export default Players();
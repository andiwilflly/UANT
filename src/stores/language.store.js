import { writable } from 'svelte/store';


function Language() {
	const { subscribe, set, update } = writable('UA');

	return {
		subscribe,
		select: (language)=> {
			return update(()=> language);
		}
	};
}

export default Language();

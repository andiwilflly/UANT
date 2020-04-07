<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import uuidv1 from 'uuid/v1';
    import FIRESTORE from '../firestore';
    import CONSTANTS from '../CONSTANTS';
    // Stores
    import players from "../stores/players.store";

    $: player = $players.all.find(player => player.firebaseId === $players.selected) || { };

    let form = {};
    const fieldsNames = [
        "name",
        "country",
        "training",
        "tactic",
        "_id",
        "age",
        "form",
        "stamina",
        "keeper",
        "pace",
        "defender",
        "technique",
        "playmaker",
        "passing",
        "striker"
    ];

    $: isDisabledForm = !!fieldsNames.find(fieldName => fieldName === 'training' ? false : form[fieldName] === undefined);


    onMount(()=> {
        form = player;
        players.subscribe((players)=> {
            form = $players.all.find(player => player.firebaseId === $players.selected) || { name: '', country: 'UA' };
        });
    });


    const onSavePlayer = ()=> {
        const playerHistory = { ...form, __time: Date.now() };

        const firebaseId = player.firebaseId || uuidv1();
        const firebasePlayerDoc = FIRESTORE[$players.selected === 'offer' ? 'offers' : 'players'].doc(firebaseId);
        const historyPlayerDoc = FIRESTORE.history.doc(firebaseId);
        const modified = Date.now();

        firebasePlayerDoc.get().then(doc => {
            firebasePlayerDoc.set({ ...form, modified })
                .then(function(p) {
                    if($players.selected === 'offer') alert("Кандидата до збірної успішно додано. \n Дякуємо за допомогу! ⚽⚽⚽");
                    if($players.selected === 'offer') return players.select(null); // No history for offer player

                    if(doc.exists) {
                        players.updatePlayer({ ...form , firebaseId : player.firebaseId, modified });
                    } else {
                        players.add({ ...form, firebaseId, modified });
                    }
                    players.select(null);

                    // Save player changes to history
                    // historyPlayerDoc.get().then(doc => {
                    //     historyPlayerDoc.set({
                    //         history: doc.exists ? [...doc.data().history, playerHistory] : [playerHistory]
                    //     })
                    // });
                })
                .catch(function(error) {
                    alert("Player save error: ", error);
                });
        });
    }
</script>


<div class="player-details">
    <p style="cursor: pointer; text-decoration: underline;"
       on:click={()=> players.select(null)}>⬅ { $_('close') }</p>
    <br/>

    { #if player.name }
        <a class="player-details-name"
           target="_blank"
           href='{`http://sokker.org/player/PID/${player._id}`}'>
            { player.name }
        </a>
    { :else }
        <p class="player-details-name">{ $players.selected === 'offer' ? $_('Candidate for the national team') : $_('New player') }</p>
    { /if }


    <div class="player-details-form">
        <div style="width: 100%;">
            <label for="name">
                { #if form._id !== '' && form._id !== undefined }
                    sokker.org player ID <span style="color: #46a146">✔</span>
                { :else }
                    sokker.org player ID <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input type="number" bind:value={form._id} />
        </div>

        <div>
            <label for="training">
                { $_('Trains now') }
            </label>
            <select bind:value={form.training}>
                <option value="">&nbsp;</option>
                <option value="невідомо">{ $_('unknown') }</option>
                { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
                    <option value={skillName}>{ $_(CONSTANTS.skills[skillName]) }</option>
                {/each }
            </select>
        </div>

        <div style="width: 100%;">
            <label for="name">
                { #if form.name !== '' && form.name !== undefined }
                    { $_('name') } <span style="color: #46a146">✔</span>
                { :else }
                    { $_('name') } <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input type="text" bind:value={form.name} />
        </div>

        <div>
            <label for="name">
                { #if form.age !== '' && form.age !== undefined }
                    { $_('age') } <span style="color: #46a146">✔</span>
                { :else }
                    { $_('age') } <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input style="width: 181px" type="number" bind:value={form.age} />
        </div>

        <div>
            <label for="name">
                { #if form.form !== '' && form.form !== undefined }
                    { $_('form') } <span style="color: #46a146">✔</span>
                { :else }
                    { $_('form') } <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input type="number" bind:value={form.form} />
        </div>

        <div>
            <label for="tactic">
                { #if form.tactic !== '' && form.tactic !== undefined }
                    { $_('tactic') } <span style="color: #46a146">✔</span>
                { :else }
                    { $_('tactic') } <span style="color: #d53e3a">⚠</span>
                { /if}

            </label>
            <input type="number" bind:value={form.tactic} />
        </div>


        <p style="width: 100%;
                  margin: 10px 0 5px 0;
                  color: rgb(237, 156, 41);
                  font-size: 18px;">
            { $_('Skills') }
        </p>

        { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
            <div>
                <label for="name">
                    { #if form[skillName] !== '' && form[skillName] !== undefined }
                        { $_(CONSTANTS.skills[skillName]) } <span style="color: #46a146">✔</span>
                    { :else }
                       { $_(CONSTANTS.skills[skillName]) } <span style="color: #d53e3a">⚠</span>
                    { /if}
                </label>
                <input type="number" bind:value={form[skillName]} />
            </div>
        { /each }

<!--        <label for="notes">Додаткова інформація про гравця <br/>(підтримує HTML теги)</label>-->
<!--        <textarea bind:value={form.notes}></textarea>-->
    </div>

    <br/>
    <div style="display: flex; justify-content: space-between">
        <button disabled='{isDisabledForm}'
                style="background: #46a146"
                on:click={onSavePlayer}>
            { #if $players.selected === 'offer' }
                { $_('Add a candidate to the national team') }
            { :else }
                { $_('Save changes') }
            { /if }
        </button>&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
</div>


<style>
    .player-details {
        height: 100%;
        box-sizing: border-box;
        background: #2d2e31;
        padding: 10px;
        overflow: auto;
    }

    .player-details-name {
        font-size: 18px;
        color: #ed9c29;
    }

    .player-details-form {
        margin: 10px 0 0 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
</style>

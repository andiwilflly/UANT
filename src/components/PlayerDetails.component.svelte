<script>
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

    $: isDisabledForm = !!fieldsNames.find(fieldName => fieldName === 'training' ? false : !form[fieldName]);


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

        firebasePlayerDoc.get().then(doc => {
            firebasePlayerDoc.set(form)
                .then(function(p) {
                    if($players.selected === 'offer') alert("Кандидата до збірної успішно додано. \n Дякуємо за допомогу! ⚽⚽⚽");
                    if($players.selected === 'offer') return players.select(null); // No history for offer player

                    if(doc.exists) {
                        players.updatePlayer({ ...form , firebaseId : player.firebaseId });
                    } else {
                        players.add({ ...form, firebaseId });
                    }
                    players.select(null);

                    // Save player changes to history
                    historyPlayerDoc.get().then(doc => {
                        historyPlayerDoc.set({
                            history: doc.exists ? [...doc.data().history, playerHistory] : [playerHistory]
                        })
                    });
                })
                .catch(function(error) {
                    alert("Player save error: ", error);
                });
        });
    }
</script>


<div class="player-details">
    <p style="cursor: pointer; text-decoration: underline;"
       on:click={()=> players.select(null)}>⬅ Заркрити</p>
    <br/>

    { #if player.name }
        <a class="player-details-name"
           target="_blank"
           href='{`http://sokker.org/player/PID/${player._id}`}'>
            { player.name }
        </a>
    { :else }
        <p class="player-details-name">{ $players.selected === 'offer' ? 'Кандидат в збірну' : 'Новий гравець' }</p>
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
                Тренує зараз
            </label>
            <select bind:value={form.training}>
                <option value="">&nbsp;</option>
                <option value="невідомо">невідомо</option>
                { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
                    <option value={skillName}>{CONSTANTS.skills[skillName]}</option>
                {/each }
            </select>
        </div>

        <div style="width: 100%;">
            <label for="name">
                { #if form.name !== '' && form.name !== undefined }
                    Ім'я <span style="color: #46a146">✔</span>
                { :else }
                    Ім'я <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input type="text" bind:value={form.name} />
        </div>

        <div>
            <label for="name">
                { #if form.age !== '' && form.age !== undefined }
                    Вік <span style="color: #46a146">✔</span>
                { :else }
                    Вік <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input style="width: 181px" type="number" bind:value={form.age} />
        </div>

        <div>
            <label for="name">
                { #if form.form !== '' && form.form !== undefined }
                    Форма <span style="color: #46a146">✔</span>
                { :else }
                    Форма <span style="color: #d53e3a">⚠</span>
                { /if}
            </label>
            <input type="number" bind:value={form.form} />
        </div>

        <div>
            <label for="tactic">
                { #if form.tactic !== '' && form.tactic !== undefined }
                    Тактична дисципліна <span style="color: #46a146">✔</span>
                { :else }
                    Тактична дисципліна <span style="color: #d53e3a">⚠</span>
                { /if}

            </label>
            <input type="number" bind:value={form.tactic} />
        </div>


        <p style="width: 100%;
                  margin: 10px 0 5px 0;
                  color: rgb(237, 156, 41);
                  font-size: 18px;">
            Навички
        </p>

        { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
            <div>
                <label for="name">
                    { #if form[skillName] !== '' && form[skillName] !== undefined }
                        {CONSTANTS.skills[skillName]} <span style="color: #46a146">✔</span>
                    { :else }
                       {CONSTANTS.skills[skillName]} <span style="color: #d53e3a">⚠</span>
                    { /if}
                </label>
                <input type="number" bind:value={form[skillName]} />
            </div>
        { /each }
    </div>

    <br/>
    <div style="display: flex; justify-content: space-between">
        <button disabled='{isDisabledForm}'
                style="background: #46a146"
                on:click={onSavePlayer}>
            { #if $players.selected === 'offer' }
                Додати кандидата в збірну
            { :else }
                Зберегти зміни
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
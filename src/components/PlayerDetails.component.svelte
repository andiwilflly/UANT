<script>
    import { onMount } from 'svelte';
    import uuidv1 from 'uuid/v1';
    import FIRESTORE from '../firestore';
    import CONSTANTS from '../CONSTANTS';
    // Stores
    import players from "../stores/players.store";

    $: player = $players.all.find(player => player.firebaseId === $players.selected) || { };

    let form = { };

    onMount(()=> {
        form = player;
        players.subscribe((players)=> {
            form = $players.all.find(player => player.firebaseId === $players.selected) || { name: '', country: 'UA' };
        });
    });

    const onSavePlayer = ()=> {
        const playerHistory = { ...form, __time: Date.now() };

        const firebaseId = player.firebaseId || uuidv1();
        const firebasePlayerDoc = FIRESTORE.players.doc(firebaseId);
        const historyPlayerDoc = FIRESTORE.history.doc(firebaseId);

        firebasePlayerDoc.get().then(doc => {
            firebasePlayerDoc.set(form)
                .then(function(p) {
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
    <a class="player-details-name"
       target="_blank"
       href='{`http://sokker.org/player/PID/${player._id}`}'>
        { player.name || 'New player' }
    </a>

    <div class="player-details-form">
        <div style="width: 100%;">
            <label for="_id">sokker.org player ID <span style="color: #d53e3a">(обов'язкове поле)</span></label>
            <input type="number" bind:value={form._id} />
        </div>

        <div style="width: 100%;">
            <label for="name">Ім'я</label>
            <input type="text" bind:value={form.name} />
        </div>
        <div style="width: 100%;">
            <label for="name">Вік</label>
            <input style="width: 181px" type="number" bind:value={form.age} />
        </div>

        <div>
            <label for="name">Вартість</label>
            <input type="number" bind:value={form.value} />
        </div>
        <div>
            <label for="name">Зарплатня</label>
            <input type="number" bind:value={form.wage} />
        </div>

        <div>
            <label for="name">Форма</label>
            <input type="text" bind:value={form.form} />
        </div>
        <div>
            <label for="name">Тактична дисципліна</label>
            <input type="number" bind:value={form.tactic} />
        </div>

        <p style="width: 100%;
                  margin: 10px 0px 5px 0;
                  color: rgb(237, 156, 41);
                  font-size: 18px;">
            Навички
        </p>

        { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
            <div>
                <label for='{skillName}'>{CONSTANTS.skills[skillName]}</label>
                <input type="text" bind:value={form[skillName]} />
            </div>
        { /each }
    </div>

    <br/>
    <div style="display: flex; justify-content: space-between">
        <button style="background: #46a146" on:click={onSavePlayer}>Зберегти зміни</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button on:click={()=> players.select(null)}>Завершити редагування</button>
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
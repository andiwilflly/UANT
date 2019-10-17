<script>
    import { onMount } from 'svelte';
    import uuidv1 from 'uuid/v1';
    import FIRESTORE from '../firestore';
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
        const firebaseId = player.firebaseId || uuidv1();
        const firebasePlayerDoc = FIRESTORE.players.doc(firebaseId);

        firebasePlayerDoc.get().then(doc => {
            firebasePlayerDoc.set(form)
                .then(function(p) {
                    if(doc.exists) {
                        players.updatePlayer({ ...form , firebaseId : player.firebaseId });
                    } else {
                        players.add({ ...form, firebaseId });
                    }
                    players.select(null);
                })
                .catch(function(error) {
                    alert("Player save error: ", error);
                });
        })
    }
</script>


<div class="player-details">
    <a class="player-details-name"
       target="_blank"
       href='{`http://sokker.org/player/PID/${player._id}`}'>
        { player.name || 'New player' }
    </a>

    <div class="player-details-form">
        <div>
            <label for="_id">sokker.org player ID <span style="color: #d53e3a">(required)</span></label>
            <input type="number" bind:value={form._id} />
        </div>

        <div>
            <label for="name">name</label>
            <input type="text" bind:value={form.name} />
        </div>
        <div>
            <label for="name">age</label>
            <input type="number" bind:value={form.age} />
        </div>

        <div>
            <label for="name">value</label>
            <input type="number" bind:value={form.value} />
        </div>
        <div>
            <label for="name">wage</label>
            <input type="number" bind:value={form.wage} />
        </div>

        <p style="width: 100%;
                  margin: 10px 0px 5px 0;
                  color: rgb(237, 156, 41);
                  font-size: 18px;">
            Skills
        </p>

        { #each Object.keys($players.skills) as skillName (skillName) }
            <div>
                <label for='{skillName}'>{skillName}</label>
                <input type="text" bind:value={form[skillName]} />
            </div>
        { /each }
    </div>

    <br/>
    <div style="display: flex; justify-content: flex-end">
        <button style="background: #46a146" on:click={onSavePlayer}>Save changes</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button on:click={()=> players.select(null)}>Cancel editing</button>
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

    .player-details-form > div {
    }
</style>
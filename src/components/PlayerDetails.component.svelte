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
    <br/>
    <br/>
    <button style="background: #46a146" on:click={onSavePlayer}>Save changes</button>&nbsp;&nbsp;&nbsp;&nbsp;
    <button on:click={()=> players.select(null)}>Cancel editing</button>

    <div class="player-details-form">
        <div>
            <label for="name">name</label>
            <input type="text" placeholder="name" bind:value={form.name} />
        </div>
        <div>
            <label for="name">age</label>
           <input type="number" placeholder="age" bind:value={form.age} />
        </div>
        <div>
            <label for="name">defender</label>
            <input type="number" placeholder="defender" bind:value={form.defender} />
        </div>
        <div>
            <label for="name">form</label>
            <input type="number" placeholder="form" bind:value={form.form} />
        </div>
        <div>
            <label for="name">keeper</label>
            <input type="number" placeholder="keeper" bind:value={form.keeper} />
        </div>
        <div>
            <label for="name">pace</label>
            <input type="number" placeholder="pace" bind:value={form.pace} />
        </div>
        <div>
            <label for="name">passing</label>
            <input type="number" placeholder="passing" bind:value={form.passing} />
        </div>
        <div>
            <label for="name">playmaker</label>
            <input type="number" placeholder="playmaker" bind:value={form.playmaker} />
        </div>
        <div>
            <label for="name">stamina</label>
            <input type="number" placeholder="stamina" bind:value={form.stamina} />
        </div>
        <div>
            <label for="name">striker</label>
           <input type="number" placeholder="striker" bind:value={form.striker} />
        </div>
        <div>
            <label for="name">technique</label>
           <input type="number" placeholder="technique" bind:value={form.technique} />
        </div>
        <div>
            <label for="name">value</label>
            <input type="number" placeholder="value" bind:value={form.value} />
        </div>
        <div>
            <label for="name">wage</label>
            <input type="number" placeholder="wage" bind:value={form.wage} />
        </div>
    </div>
</div>


<style>
    .player-details {
        height: 100%;
        box-sizing: border-box;
        background: #101215;
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
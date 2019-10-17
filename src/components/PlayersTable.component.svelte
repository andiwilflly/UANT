<script>
    import FIRESTORE from '../firestore';
    // Stores
    import players from "../stores/players.store";


    FIRESTORE.players.get().then((querySnapshot)=> {
        querySnapshot.forEach((doc)=> {
            players.add({ ...doc.data(), firebaseId: doc.id });
        });
    });


    const onPlayerDelete = (player)=> {
        const isConfirmed = confirm(`Player ${player.name} will be deleted`);
        if(!isConfirmed) return;

        FIRESTORE.players.doc(player.firebaseId).delete()
            .then(function() {
                players.delete(player.firebaseId);
            })
            .catch(function(error) {
                alert("Player delete error: ", error);
            });
    };

</script>


<div class="players-table" style="">
    <button on:click={()=> players.select('new')}>+ Add new player</button>&nbsp;&nbsp;&nbsp;&nbsp;
    <button on:click={()=> window.firebase.auth().signOut()}>LogOut</button>
    <br/>
    <br/>

    <table>
        <thead>
            <tr>
                <td>name</td>
                <td>age</td>
                <td>wage</td>
                <td>form</td>

                <td>stamina</td>
                <td>keeper</td>
                <td>pace</td>
                <td>defender</td>
                <td>technique</td>
                <td>playmaker</td>
                <td>passing</td>
                <td>striker</td>
                <td></td>
                <td></td>
            </tr>
        </thead>
        <tbody>
        { #each $players.all as player (player.firebaseId) }
            <tr class='{ $players.selected === player.firebaseId ? "active": "" }'>
                <td>{ player.name || '' }</td>
                <td>{ player.age || '' }</td>
                <td>{ player.wage || '' }</td>
                <td>{ player.form || '' }</td>

                <td>{ player.stamina }</td>
                <td>{ player.keeper }</td>
                <td>{ player.pace }</td>
                <td>{ player.defender }</td>
                <td>{ player.technique }</td>
                <td>{ player.playmaker }</td>
                <td>{ player.passing }</td>
                <td>{ player.striker }</td>

                <td><button on:click={()=> players.select(player.firebaseId) }>Edit</button></td>
                <td><button on:click={()=> onPlayerDelete(player) }>Delete</button></td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>


<style>
    .players-table {
        background: #101215;
        padding: 15px;
        overflow: auto;
        height: 100%;
        box-sizing: border-box;
    }

    table {
        width: 100%;
        border-spacing: unset;
    }

    tr:nth-child(even) {
        background: rgba(20, 22, 25, 0.83);
    }

    tr.active {
        color: #f0cb04;
    }

    td {
        border-bottom: 1px solid #2a2d31;
        padding: 10px;
    }
</style>
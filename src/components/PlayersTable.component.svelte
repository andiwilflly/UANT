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
    <button on:click={()=> players.select('new')}>+ Add new player</button>
    <br/>
    <br/>

    <table>
        <thead>
            <tr>
                <td>Name</td>
                <td>Age</td>
                <td>Wage</td>
                <td>Form</td>
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
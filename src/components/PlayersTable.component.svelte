<script>
    import FIRESTORE from '../firestore';
    // Stores
    import players from "../stores/players.store";


    FIRESTORE.players.get().then((querySnapshot)=> {
        querySnapshot.forEach((doc)=> {
            players.add({ ...doc.data(), firebaseId: doc.id });
        });
    });

    const formatter = new Intl.NumberFormat("ua", { });

    const skills = {
        'stamina': 'витривалість',
        'keeper': 'воротарство',
        'pace': 'швидкість',
        'defender': 'захист',
        'technique': 'техніка',
        'playmaker': 'півзахист',
        'passing': 'пас',
        'striker': 'напад'
    };

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
    <button style="background: #46a146" on:click={()=> players.select('new')}>+ Add new player</button>&nbsp;&nbsp;&nbsp;&nbsp;
    <button style="background:#d53e3a" on:click={()=> window.firebase.auth().signOut()}>LogOut</button>
    <br/>
    <br/>

    <div class="players-list-inner">
        { #each $players.all as player (player.firebaseId) }
            <div class='{ $players.selected === player.firebaseId ? "player active": "player" }'>
                <div class="player-inner">
                    <div class="player-info">
                        <a class="player-name"
                           target="_blank"
                           href='{`http://sokker.org/player/PID/${player._id}`}'>{ player.name }, { player.age }</a>
                        <p>Вартість <span style="color: #46a146">{ formatter.format(player.value) }</span> грн.</p>
                        <p>Зарплатня <span style="color: #46a146">{ formatter.format(player.wage) }</span> грн.</p>
                        <p>Форма <span style="color: #ed9c29"> [ { formatter.format(player.form) } ]</span></p>
                    </div>
                    <div class="player-stats">
                        { #each Object.keys(skills) as skillName (skillName) }
                           <div>
                               <p>{skills[skillName]}:</p>
                               <p><span style="color: #ed9c29"> [ { player[skillName] } ]</span></p>
                           </div>
                        { /each }
                    </div>
                    <div class="player-actions">
                        <button on:click={()=> players.select(player.firebaseId) }>Edit</button>
                        <button style="background:#d53e3a" on:click={()=> onPlayerDelete(player) }>Delete</button>
                    </div>
                </div>
            </div>
        { /each }
    </div>
</div>


<style>
    .players-list {
        background: #101215;
        padding: 15px;
        overflow: auto;
        height: 100%;
        box-sizing: border-box;
    }

    .players-list-inner {
        display: flex;
        flex-wrap: wrap;
    }

    .player {
        width: 100%;
        background: #101215;
        margin: 1px 0;
        padding: 10px;
        border: 1px solid transparent;
    }

    .player-name {
        font-size: 17px;
        display: inline-block;
        margin-bottom: 10px;
    }

    .player-inner {
        font-size: 13px;
        display: flex;
        justify-content: space-between;
    }

    .player-info {
        width: 30%;
        max-width: 250px;
    }

    .player-stats {
        width: 50%;
        max-width: 400px;
        display: flex;
        flex-wrap: wrap;
    }

    .player-stats > div {
        width: 50%;
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        box-sizing: border-box;
    }

    .player-actions {
        width: 200px;
        display: flex;
    }

    .player-actions button {
        margin: 5px;
        height: 30px;
        width: 100px;
    }

    .player.active p {
        color: #5bc0de;
    }
</style>
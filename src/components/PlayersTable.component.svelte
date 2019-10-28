<script>
    import FIRESTORE from '../firestore';
    import CONSTANTS from '../CONSTANTS';
    // Stores
    import players from "../stores/players.store";
    import { user } from "../stores/user.store";


    FIRESTORE.players.get().then((querySnapshot)=> {
        querySnapshot.forEach((doc)=> {
            players.add({ ...doc.data(), firebaseId: doc.id });
        });
    });

    const formatter = new Intl.NumberFormat("ua", { });

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


    const onPlayerEdit = (player)=> {
        players.select(player.firebaseId);
        window.scrollTo(0, 0)
    };

</script>


<div class="players-table" style="">

    <br/>
    { #if $user !== null }
        <button style="background: #46a146" on:click={()=> players.select('new')}>+ Додати гравця</button>&nbsp;&nbsp;&nbsp;&nbsp;
    { /if }
    { #if $user === null }
        <button style="background: #46a146" on:click={()=> players.select('offer')}>+ Запропонувати гравця</button>&nbsp;&nbsp;&nbsp;&nbsp;
    { /if }

    Всього гравців: {$players.all.length}
    <br/>


<!--    TODO: Добавить молодежку (просто сортировать в разніх табах) -->
    <div class="players-list-inner">
        { #each $players.all.sort((a,b)=> a.value > b.value ? -1 : 1) as player (player.firebaseId) }
            <div class='{ $players.selected === player.firebaseId ? "player active": "player" }'>
                <div class="player-inner">
                    <div class="player-info">
                        <a class="player-name"
                           target="_blank"
                           href='{`http://sokker.org/player/PID/${player._id}`}'>{ player.name }, { player.age }</a>
                        <p>Вартість <span style="color: #46a146">{ formatter.format(player.value || 0) }</span> грн.</p>
                        <p>Зарплатня <span style="color: #46a146">{ formatter.format(player.wage || 0) }</span> грн.</p>
                        <p>Тактична дисципліна [&nbsp;<span style="color: #ed9c29">{ player.tactic || 0 }</span>&nbsp;]</p>
                        <p>Форма [&nbsp;<span style="color: #ed9c29">{ player.form || 0 }</span>&nbsp;]</p>
                    </div>
                    <div class="player-stats">
                        { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
                           <div>
                               <p>{CONSTANTS.skills[skillName]}:</p>
                               <p>[&nbsp;<span style="color: #ed9c29"> { player[skillName] === undefined ? '' : player[skillName] }</span>&nbsp;]</p>
                           </div>
                        { /each }
                    </div>
                    { #if $user !== null }
                        <div class="player-actions">
                            <button on:click={ ()=> onPlayerEdit(player) }>Редагувати</button>
                            <button style="background:#d53e3a" on:click={()=> onPlayerDelete(player) }>Видалити</button>
                        </div>
                    { /if }
                </div>
            </div>
        { /each }
    </div>
</div>


<style>
    .players-list {
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
        background: #2d2e31;
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
        height: 33px;
        width: 100px;
    }

    .player.active {
        background: #101215;
    }
</style>
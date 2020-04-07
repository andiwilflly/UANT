<script>
    import { _ } from 'svelte-i18n';
    import Fuse from "fuse.js";
    import FIRESTORE from '../firestore';
    import CONSTANTS from '../CONSTANTS';
    import uuidv1 from 'uuid/v1';
    // Stores
    import players from "../stores/players.store";
    import { user } from "../stores/user.store";

    export let u21;
    export let offers;

    if(!$players.all.length && !offers) {
        FIRESTORE.players.get().then((querySnapshot)=> {
            querySnapshot.forEach((doc)=> {
                players.add({ ...doc.data(), firebaseId: doc.id });
            });
        });
    } else
    if(!$players.offers.length && offers) {
        FIRESTORE.offers.get().then((querySnapshot)=> {
            querySnapshot.forEach((doc)=> {
                players.addOffer({ ...doc.data(), firebaseId: doc.id });
            });
        });
    }

    const formatter = new Intl.NumberFormat("ua", { });

    const filters = {
        sortBy: 'name',
        isAsc: false, // desc
        search: ''
    };

    const onPlayerDelete = (player)=> {
        const isConfirmed = confirm(`Гравець ${player.name} буде видалений з бази. Ви впевнені?`);
        if(!isConfirmed) return;

        FIRESTORE.players.doc(player.firebaseId).delete()
            .then(function() {
                players.delete(player.firebaseId);
            })
            .catch(function(error) {
                alert("Player delete error: ", error);
            });
    };


    const onOfferDelete = (player)=> {
        FIRESTORE.offers.doc(player.firebaseId).delete()
            .then(function() {
                players.deleteOffer(player.firebaseId);
            })
            .catch(function(error) {
                alert("Offer delete error: ", error);
            });
    };


    const onPlayerEdit = (player)=> {
        players.select(player.firebaseId);
        window.scrollTo(0, 0)
    };


    const onSaveNewPlayer = (player)=> {
        onOfferDelete(player); // Delete offer

        const firebaseId = player.firebaseId || uuidv1();
        const firebasePlayerDoc = FIRESTORE.players.doc(firebaseId);

        firebasePlayerDoc.get().then(doc => {
            firebasePlayerDoc.set(player)
                .then(function(p) {
                    if($players.all.length) players.add({ ...player, firebaseId }); // If no [length] -> wi will fetch [players.all]
                    players.select(null);
                })
                .catch(function(error) {
                    alert("New player save error: ", error);
                });
        });
    };


    const onSortBy = (sortBy = '')=> {
        filters.isAsc = filters.sortBy === sortBy ? !filters.isAsc : false;
        filters.sortBy = sortBy;
    };


    const options = {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: [
            "name"
        ]
    };


    $: playersList = (offers ? $players.offers : $players.all.filter(player => u21 ? player.age <= 21 : player.age > 21)).sort((a, b)=> {
        if(a[filters.sortBy] === undefined || b[filters.sortBy] === undefined) return 0; // No sorting

        if(!isNaN(+a[filters.sortBy])) return filters.isAsc ? // Number
            a[filters.sortBy] > b[filters.sortBy] ? 1 : -1
            :
            a[filters.sortBy] > b[filters.sortBy] ? -1 : 1;

        return filters.isAsc ? // String
            b[filters.sortBy].localeCompare(a[filters.sortBy])
            :
            a[filters.sortBy].localeCompare(b[filters.sortBy])
    });

    $: fuse = new Fuse(playersList, options);
</script>


<div class="players-table" style="">

    <h2>{
        u21 ?
            $_('Youth team')
            :
            offers ?
                $_('Candidates for the national team')
                :
                $_('National team')
    }</h2>

    { #if $user !== null && !offers }
        <button style="background: #46a146" on:click={()=> players.select('new')}>+ { $_('Add a player') }</button>&nbsp;&nbsp;&nbsp;&nbsp;
    { /if }
    { #if $user === null }
        <button style="background: #46a146" on:click={()=> players.select('offer')}>+ { $_('Suggest a player') }</button>&nbsp;&nbsp;&nbsp;&nbsp;
    { /if }

    { $_('Total players') }: <span style="color: #ed9c29">{playersList.length}</span>

    <br/>

    <div class="players-list-inner">

        <div class="players-list-filters">
            { #each Object.keys(CONSTANTS.skills) as name }
                <button on:click={ ()=> onSortBy(name) }>
                    { #if filters.sortBy === name }
                        <span>{ filters.isAsc ? '⬆' : '⬇' }</span>
                    { /if }
                    { $_(CONSTANTS.translations[name] || CONSTANTS.skills[name] || name) }
                </button>
            { /each }
        </div>

        <div class="players-list-filters">
            { #each ['name', 'age', 'tactic', 'form', 'modified'] as name }
                <button on:click={ ()=> onSortBy(name) }>
                    { #if filters.sortBy === name }
                        <span>{ filters.isAsc ? '⬆' : '⬇' }</span>
                    { /if }
                    { $_(CONSTANTS.translations[name] || CONSTANTS.skills[name] || name) }
                </button>
            { /each }
            &nbsp;<input placeholder={ $_("Search by player name") } type="search" style="width: 300px" bind:value={filters.search}  />
        </div>

        { #if $players.all.length && (!(filters.search.length >= 3 ? fuse.search(filters.search) : playersList).length) }
            <div class="player">
                { $_('No players found') }
            </div>
        { /if }

        { #each filters.search.length >= 3 ? fuse.search(filters.search) : playersList as player (player.firebaseId) }
            <div class='{ $players.selected === player.firebaseId ? "player active": "player" }'>
                <div class="player-inner">
                    <div class="player-info">
                        <a class="player-name"
                           target="_blank"
                           href='{`http://sokker.org/player/PID/${player._id}`}'>{ player.name }, { player.age }</a>
                        <p>{ $_('Trains now')}: <span style="color: #46a146">{ $_(CONSTANTS.skills[player.training]) || $_('unknown') }</span></p>
                        <p>{ $_('tactic') } [&nbsp;<span style="color: #ed9c29">{ player.tactic || 0 }</span>&nbsp;]</p>
                        <p>{ $_('form') } [&nbsp;<span style="color: #ed9c29">{ player.form || 0 }</span>&nbsp;]</p>
                    </div>
                    <div class="player-stats">
                        { #each Object.keys(CONSTANTS.skills) as skillName (skillName) }
                            <div>
                                <p>{ $_(CONSTANTS.skills[skillName]) }:</p>
                                { #if player[skillName] > 14 }
                                   <p>[&nbsp;<span style="color: #ed2a2c"> { player[skillName] === undefined ? '' : player[skillName] }</span>&nbsp;]</p>
                                { :else if player[skillName] >= 10 }
                                   <p>[&nbsp;<span style="color: #ed5d1f"> { player[skillName] === undefined ? '' : player[skillName] }</span>&nbsp;]</p>
                                { :else if player[skillName] <= 5  }
                                   <p>[&nbsp;<span style="color: #f9d349"> { player[skillName] === undefined ? '' : player[skillName] }</span>&nbsp;]</p>
                                { :else }
                                   <p>[&nbsp;<span style="color: #ed9c29"> { player[skillName] === undefined ? '' : player[skillName] }</span>&nbsp;]</p>
                                { /if }
                            </div>
                        { /each }
                    </div>
                    { #if $user !== null }
                        <div class="player-actions">
                            { #if offers }
                                <button style="background: #46a146" on:click={ ()=> onSaveNewPlayer(player) }>{ $_('Add') }</button>
                                <button style="background:#d53e3a" on:click={()=> onOfferDelete(player) }>{ $_('Remove') }</button>
                            {:else}
                                <button on:click={ ()=> onPlayerEdit(player) }>{ $_('Edit') }</button>
                                <button style="background:#d53e3a" on:click={()=> onPlayerDelete(player) }>{ $_('Remove') }</button>
                            { /if }
                        </div>
                    { /if }
                </div>

                { #if !offers }
                    <div style="float: right;font-size: 12px;"
                         class='{ (Date.now() - player.modified) / (24 * 60 * 60 * 1000) > 30 ? "orange-text": "" }'>
                        { $_("Last modified") }:
                        { player.modified ?
                            (Date.now() - player.modified) / (24 * 60 * 60 * 1000) > 30 ?
                                new Date(player.modified).toLocaleString() + ' (' +  Math.ceil((Date.now() - player.modified) / (24 * 60 * 60 * 1000)) + ' ' + $_('days ago') + ')'
                                :
                                new Date(player.modified).toLocaleString()
                            :
                            $_('unknown') }
                    </div>
                { /if }

<!--                <p style="color: #929283; font-size: 11px; margin: 5px 0;">{ @html player.notes || '' }</p>-->
            </div>
        { /each }
    </div>
</div>


<style>
    .orange-text {
        color: #ed9c29;
    }

    .players-list-inner {
        display: flex;
        flex-wrap: wrap;
    }

    .players-list-filters {
        //margin: 10px 0;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: flex-end;
    }

    .players-list-filters > button {
        margin: 0 0 5px 5px;
        height: 36px;
        background: #0088cb;
    }

    .players-list-filters > div {
        margin: 0 0 0 5px;
    }

    .players-list-filters span {
        color: white;
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
        font-size: 15px;
        max-width: 280px;
    }

    .player-stats {
        width: 50%;
        font-size: 15px;
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

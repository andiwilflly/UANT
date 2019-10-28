<script>
    // Stores
    import players from "../stores/players.store";
    // Components
    import PlayersTable from "./PlayersTable.component.svelte";
    import PlayerDetails from "./PlayerDetails.component.svelte";

    export let u21;
    export let offers;
</script>


<div class="players">

    <div style="padding: 10px;" class='{ $players.selected ? "short" : "long" }'>
        <PlayersTable u21={ u21 } offers={ offers } />
    </div>


    { #if $players.selected }
        <div class='player-details-wrapper'>
            <PlayerDetails />
        </div>
    {/if}
</div>


<style>
    .players {
        background: #101215;
        width: 100%;
        display: flex;
        position: relative;
    }

    .short {
        width: calc(100% - 400px);
        overflow: auto;
    }

    .long {
        width: 100%;
    }

    .player-details-wrapper {
        width: calc(400px);
        margin: 20px 10px 10px 0;
    }

</style>
<script>
    // Stores
    import players from "../stores/players.store";
    // Components
    import PlayersTable from "./PlayersTable.component.svelte";
    import PlayerDetails from "./PlayerDetails.component.svelte";

</script>


<div class="players">

    <div class='{ $players.selected ? "short" : "long" }'>
        <PlayersTable />
    </div>


    { #if $players.selected }
        <div class='player-details-wrapper'>
            <PlayerDetails />
        </div>
    {/if}
</div>


<style>
    .players {
        height: 100%;
        padding: 0;
        position: relative;
    }

    .short {
        height: calc(100% - 300px);
    }

    .long {
        height: 100%;
    }

    .player-details-wrapper {
        margin-top: 15px;
        height: calc(300px - 15px);
    }

</style>
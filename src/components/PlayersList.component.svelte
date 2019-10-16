<script>
    import { user } from "../stores/user.store";


    console.log($user, '$user!')
</script>


<div class="players-list">Players List ... {$user} </div>

<style>

    .players-list {
        margin: 20px 0;
    }
</style>
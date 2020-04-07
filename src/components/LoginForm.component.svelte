<script>
    import { navigate } from "svelte-routing";
    // Stores
    import { user } from "../stores/user.store";
    import players from "../stores/players.store";

    let form = {
        email: '',
        password: ''
    };

    let errorMsg = null;

    const onSubmit = (e)=> {
        e.preventDefault();

        errorMsg = null;

        window.firebase.auth().signInWithEmailAndPassword(form.email, form.password)
            .then((a)=> {
                user.signIn(window.firebase.auth().currentUser);
                players.clearAll();
                navigate("/", { replace: true });
            }).catch((e)=> {
                errorMsg = e.message;
            });
    }
</script>

<div class="login">

    <div class="logo" />

    <div class="divider" />

    <div class="form">
        <form on:submit={onSubmit}>
            <input type="text" placeholder="email" bind:value={form.email} />
            <input type="password" placeholder="password" bind:value={form.password} />
            <button type="submit" disabled={!form.email || !form.password}>Login</button>

            { #if errorMsg }
                <p class="error-msg">{errorMsg}</p>
            {/if}
        </form>
    </div>
</div>



<style>

    .login {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        height: inherit;
    }

    .logo {
        width: 50%;
        height: 400px;
        background: url(logo.png) center;
        background-size: 200px;
        background-repeat: no-repeat;

    }

    .divider {
        background: #ed9c29;
        width: 1px;
        height: 300px;
    }

    .form {
        width: 50%;
        display: flex;
        justify-content: center;
    }

    form {
        width: 250px;
    }

    .error-msg {
        color: #d53e3a;
        position: absolute;
    }
</style>
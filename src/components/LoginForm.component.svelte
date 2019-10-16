<script>
    import { fade } from 'svelte/transition';

    let form = {
        email: '',
        password: ''
    };

    let visible = false;

    setTimeout(()=> visible = true, 1500);

    const onSubmit = (e)=> {
        e.preventDefault();

        console.log(form, '???');
    }
</script>

{ #if visible }
    <div class="login" transition:fade>

        <div class="logo" />

        <div class="divider" />

        <div class="form">
            <form on:submit={onSubmit}>
                <input type="text" placeholder="email" bind:value={form.email} />
                <input type="text" placeholder="password" bind:value={form.password} />
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
{ /if }



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
</style>
<script>
	import { Router, Link, Route, navigate } from "svelte-routing";
	// Stores
	import { user } from "./stores/user.store";
	import players from "./stores/players.store";
	// Components
	import Players from './components/Players.component.svelte';
	import LoginForm from './components/LoginForm.component.svelte';

	let mounted = false;

	firebase.auth().onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			user.signIn(firebaseUser);
			mounted = true;
		} else {
			user.signOut();
			mounted = true;
		}
	});

	export let url = "";


	const signOut = ()=> {
		window.firebase.auth().signOut();
		players.select(null);
		navigate("/", { replace: true });
	}
</script>

<div class="content">

	{#if mounted }
		<Router url="{url}">
			<nav>
				<div><Link to="/">Збірна</Link></div>
				<div><Link to="/u21">U-21</Link></div>
				{ #if $user === null }
					<div><Link style="color: #46a146; cursor: pointer; text-decoration: underline;" to="login">Залогінитись</Link></div>
				{ /if }
				{ #if $user !== null }
					<div><Link to="/offers">Кандидати в збірну</Link></div>
					<div><p style="color: #d53e3a; cursor: pointer; text-decoration: underline;" on:click={signOut}>Розлогінитись</p></div>
				{ /if }
			</nav>

			<Route path="login">
				{ #if $user === null }
					<LoginForm />
				{ /if }
			</Route>

			<div style="margin-top: 40px">
				<Route path="/"><Players u21={false} offers={false} /></Route>
				<Route path="/u21"><Players u21={true} offers={false} /></Route>
				{ #if $user !== null }
					<Route path="/offers"><Players u21={false} offers={true} /></Route>
				{ /if }
			</div>
		</Router>
	{/if}
</div>

<!-- white #a3a394 -->
<!-- bg #2d2e31 -->
<!-- darkBg #101215 -->
<!-- green #46a146 -->
<!-- orange #ed9c29 -->
<!-- light-blue #5bc0de -->
<!-- blue #0088cb -->
<!-- red #d53e3a -->

<style>
	:global(body) {
		background: #2d2e31;
		font-family: 'Poppins', sans-serif;
		color: #a3a394;
		font-size: 15px;
		padding: 0;
		height: 100%;
		overflow-y: scroll;
		position: relative;
	}

	:global(p) {
		margin: 0;
	}

	:global(a) {
		color: #0088cb !important;
		text-decoration: underline;
		transition: 0.4s opacity ease;
	}

	:global(a:hover) {
		opacity: 0.8;
		text-decoration: none;
	}

	:global(input) {
		border: none;
		outline: none;
		width: 100%;
	}


	:global(button) {
		background: #ed9c29;
		border: none;
		cursor: pointer;
		color: white;
		padding: 7px 10px;
		transition: 0.3s opacity ease;
	}

	:global(button:hover) {
		opacity: 0.7;
	}

	:global(button:disabled) {
		background: #2d2e31;
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(span) {
		color: gray
	}

	nav {
		box-shadow: -2px 4px 16px -1px black;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 27px;
		background: #191c20;
		z-index: 2;
		padding: 10px;
		display: flex;
	}

	nav > div {
		margin: 0 10px;
	}

	.content {
		background: #191c20;
		height: 100%;
		box-sizing: border-box;
	}
</style>
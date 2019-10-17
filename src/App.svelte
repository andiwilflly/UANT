<script>
	// Stores
	import { user } from "./stores/user.store";
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
</script>

<div class="content">
	{#if mounted && $user === null }
		<LoginForm />
	{/if}

	{#if mounted && $user }
		<Players />
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
		overflow: hidden;
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

	:global(span) {
		color: gray
	}

	.content {
		background: #191c20;
		height: 100%;
		box-sizing: border-box;
		padding: 20px;
	}
</style>
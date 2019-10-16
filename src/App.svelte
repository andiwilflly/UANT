<script>
	// Stores
	import { user } from "./stores/user.store";
	// Components
	import PlayersList from './components/PlayersList.component.svelte';
	import LoginForm from './components/LoginForm.component.svelte';

	let time = new Date().toLocaleString();
	setTimeout(()=> time = new Date().toLocaleString(), 0);
</script>

<div class="content">
<!--	<span>{ time }</span>-->

	{#if $user === null }
		<LoginForm />
	{/if}

	{#if $user }
		<PlayersList />
	{/if}
</div>

<!-- white white -->
<!-- bg #2e2f32 -->
<!-- darkBg #191c20 -->
<!-- green #46a146 -->
<!-- orange #ed9c29 -->
<!-- light-blue #5bc0de -->
<!-- blue #0088cb -->
<!-- red #d53e3a -->

<style>
	:global(body) {
		background: #2e2f32;
		font-family: 'Poppins', sans-serif;
		color: #f0cb04;
		font-size: 15px;
		padding: 0;
		height: auto;
	}

	:global(a) {
		color: #f0cb04 !important;
		text-decoration: underline;
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
		height: 100vh;
	}
</style>
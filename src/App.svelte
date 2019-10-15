<script>
	import Button from '@smui/button';
	import Label from '@smui/label';

	import Nested from './components/Nested.svelte';
</script>


<div class="bg" >
	<div class="content">
		Ukraine national team database

		<Button on:click={()=> alert('Clicked!')}>Just a Button</Button>
		<Button variant="raised"><Label>Raised Button, Using a Label</Label></Button>
		<Button some-arbitrary-prop="placed on the actual button">Button</Button>

		<Nested/>
	</div>
</div>


<style>

	.bg {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		opacity: 0.5;
		background: url(ntbg.jpg);
		background-size: cover;
	}

	.content {
		background: white;
		padding: 10px;
		margin: 50px auto;
		max-width: 900px;
	}
</style>
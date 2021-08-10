<script>
	import { numClicks, helpNeeded } from '../stores.js';
	import LeafletMap from '$lib/LeafletMap.svelte';

	var count_value;
	var help_value;
	var textInfo;

	numClicks.subscribe(value => {
		count_value = value;
	});

	helpNeeded.subscribe(value => {
		help_value = value;
	});

</script>

<main>
	<h1>{count_value}</h1>

	{#if help_value}
		<p>You need more help!</p>
	{:else}
		<p>You are fine!</p>
	{/if}
	<LeafletMap />
</main>
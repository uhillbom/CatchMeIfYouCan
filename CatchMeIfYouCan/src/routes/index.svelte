<script>
	import { numClicks, helpNeeded} from '../stores.js';
	import LeafletMap from '$lib/LeafletMap.svelte';
	import * as myjson from '../json/test.json';

</script>

<main>
	<h1>{$numClicks}</h1>

	<p>{myjson.city1.lat}</p>
	<p>{myjson.city1.lon}</p>

	{#if $helpNeeded}
		<p>You need more help!</p>
	{:else}
		<p>You are fine!</p>
	{/if}
	<LeafletMap latObject={myjson.city1.lat} lonObject={myjson.city1.lon}/>
</main>
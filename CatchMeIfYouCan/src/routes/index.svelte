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

	if (help_value >= 1)
	{
		textInfo = 'You need more help!!';
	}
	else if (help_value == 0)
	{
		textInfo = 'Everything is ok!';
	}

</script>

<main>
	<h1>{count_value}</h1>

	<p>{help_value}</p>
	<h2>{textInfo}</h2>
	<LeafletMap />
</main>
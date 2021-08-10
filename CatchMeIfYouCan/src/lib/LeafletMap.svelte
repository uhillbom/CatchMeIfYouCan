<script>

    // TODO:
    // 1. Randomize a start lat, long
    // 2. Show a text that you go in the wrong direction.  -- almost finished

    import { numClicks, helpNeeded } from '../stores.js';
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { haversine } from '$lib/helpers.js';

    export let latObject;
	export let lonObject;

    let positionOfObject = [latObject, lonObject];

    const distEnum = {
        FOUND : 1,
        CLOSE : 10,
        NEAR  : 100,
        FAR   : 1000,
    }

    const clicksInWrongDirBeforeHelp = 3;

    //var numClicks = 0;
    var distanceDiffNow =  5000; // High value to not set found

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

            const map = leaflet.map('map').setView(positionOfObject, 3);

            var greenIcon = L.icon({
                iconUrl: 'src/img/plane2.png',

                iconSize:     [20, 20], // size of the icon
                iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
            });

            var bullseye = L.icon({
                iconUrl: 'src/img/bullseye.png',

                iconSize:     [100, 100], // size of the icon
                iconAnchor:   [50, 50], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
            });

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var lastDistanceDiff = 0;
            var consecutiveStepsInWrongDirectionOld = 0;
            var latlngs = Array();

            map.on('click',function(e){
                var lat = e.latlng.lat;
                var lon = e.latlng.lng;
                latlngs[1] = [lat, lon];
                numClicks.update(n => n + 1);

                let val
                numClicks.subscribe($ => val = $)()

                console.log("You clicked the map at LAT: "+ lat+" and LONG: "+lon );
                distanceDiffNow = haversine(positionOfObject[0], positionOfObject[1], lat, lon);

                // calculate the distance difference in order to see if we are heading towards or away from the object.
                var distanceDifferenceToLastPoint = distanceDiffNow - lastDistanceDiff;
                var consecutiveStepsInWrongDirection = stepsInWrongDirection(consecutiveStepsInWrongDirectionOld, distanceDifferenceToLastPoint);
                consecutiveStepsInWrongDirectionOld = consecutiveStepsInWrongDirection;
                //
                var helpNeededTmp = needsMoreHelp(consecutiveStepsInWrongDirection);
                if (helpNeededTmp)
                    helpNeeded.update(n => 1);
                else
                    helpNeeded.update(n => 0);

                console.log(helpNeededTmp);
                console.log("Distance between you and me is : "  + distanceDiffNow.toFixed(1));
                var distEnumSel = distToEnum(distanceDiffNow, distEnum);
                console.log(distEnumSel);
                console.log(distanceDifferenceToLastPoint.toFixed(1))
                console.log("Num clicks " + val);

                // Store  the last distance for next click diff calculation
                lastDistanceDiff = distanceDiffNow;

                if (distanceDiffNow <= distEnum.FOUND)
                    leaflet.marker(positionOfObject, {icon: bullseye}).addTo(map);

                //Clear existing marker - not needed any more.
                //if (theMarker != undefined) {
                //    map.removeLayer(theMarker);
                //};

                //Add a marker to show where you clicked.
                leaflet.marker([lat,lon], {icon: greenIcon}).addTo(map);
                //Add a line between the last two clicked positions.

                if (val > 1)
                    var polyline = leaflet.polyline(latlngs, {color: 'red'}).addTo(map);

                console.log(latlngs)
                latlngs[0] = [lat,lon];

            });

        }
    });

    function stepsInWrongDirection(cntIn, distanceDifferenceToLastPoint) {
        var cntOut = {};
        if (distanceDifferenceToLastPoint > 0) {
            cntOut = cntIn + 1;
        }
        else {
            cntOut = 0;
        }
        return cntOut;
    };

    function distToEnum(distance, distEnum)
    {
        if (distance <= distEnum.FOUND)
        {
            return "You have found me!!";
        }
        else if (distance <= distEnum.CLOSE)
        {
            return "You are close now";
        }
        else if (distance <= distEnum.NEAR)
        {
            return "You are near!";
        }
        else if (distance <= distEnum.FAR)
        {
            return "You are far from me!";
        }
        else {
            return "Ha ha.. not even close!"
        }
    };

    function needsMoreHelp(consecutiveStepsInWrongDirection) {
        if (consecutiveStepsInWrongDirection >= clicksInWrongDirBeforeHelp)
            return true;
        else
            return false;
    };

</script>


<main>
    <div id="map"></div>
</main>

<style>
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    main #map {
        height: 800px;
    }
</style>
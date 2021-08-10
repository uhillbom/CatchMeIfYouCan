export function haversine(lat1, lon1, lat2, lon2)
{
	// distance between latitudes and longitudes
	var dLat = degToRad(lat2 - lat1);
	var dLon = degToRad(lon2 - lon1);

	// convert to radians
	lat1 = degToRad(lat1);
	lat2 = degToRad(lat2);

	// apply formulae
	var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
	let earthrad = 6371;
	var c = 2 * Math.asin(Math.sqrt(a));
	return earthrad * c;
};

function degToRad(degrees) {
	return degrees * Math.PI / 180;
};
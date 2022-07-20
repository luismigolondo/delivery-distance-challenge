//Creamos globales del DOM

const formulario = document.getElementById('inputDelivery');
const inputDir1 = document.getElementById('direccion1');
const inputDir2 = document.getElementById('direccion2');

//Leaflet Boiler Plate Basico https://github.com/ryerson-ggl/tutorial-express-leaflet

// Creates a leaflet map binded to an html <div> with id "map"
// setView will set the initial map view to the location at coordinates
// 13 represents the initial zoom level with higher values being more zoomed in
const map = L.map('map').setView([5.0513852, -75.4847779], 9);

// Adds the basemap tiles to your web map
// Additional providers are available at: https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 21
}).addTo(map);

function addPins(direccion1, direccion2, distancia) {
	//Limpiamos el mapa antes de la siguiente consulta. 
	// https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet
	map.eachLayer((layer) => {
		if (layer['_latlng'] != undefined)
			layer.remove();
	});

	let dir1GEO = direccion1.coordinates;
	let dir2GEO = direccion2.coordinates;

	let marcador1 = L.marker(dir1GEO).addTo(map);
	let marcador2 = L.marker(dir2GEO).addTo(map);

	let linea = L.polygon([dir1GEO, dir2GEO]).bindTooltip(distancia, {
		permanent: true,
		direction: "center"
	}).addTo(map);

	let limites = L.latLngBounds([dir1GEO, dir2GEO]);
	map.fitBounds(limites);
};

//Guardamos historial y pintamos los marcadores
async function calcularDistancia(e) {
	e.preventDefault();
	//Validacion
	if (inputDir1.value === '' || inputDir2.value === '') {
		alert("Por favor llene ambas direcciones...");
		return;
	}

	const sendBody = {
		direccion1: inputDir1.value,
		direccion2: inputDir2.value
	}

	try {
		const publicarHistorial = await fetch('/api/historial', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sendBody)
		});

		if (publicarHistorial.status == 500) {
			throw Error('No se pudo encontrar alguna de las direcciones...');
		}

		const respuesta = await publicarHistorial.json();
		const dir1 = respuesta.data.direccion1GEO;
		const dir2 = respuesta.data.direccion2GEO;
		const dist = `${respuesta.data.distancia} KM`;

		addPins(dir1, dir2, dist);

	} catch (error) {
		alert(error.message);
		return;
	}

}

formulario.addEventListener('submit', calcularDistancia);
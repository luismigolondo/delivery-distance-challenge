//Creamos globales del DOM
const formulario = document.getElementById('inputDelivery');
const inputDir1 = document.getElementById('direccion1');
const inputDir2 = document.getElementById('direccion2');

//Leaflet Boiler Plate Basico https://github.com/ryerson-ggl/tutorial-express-leaflet
// Creates a leaflet map binded to an html <div> with id "map"
// setView will set the initial map view to the location at coordinates
// 9 represents the initial zoom level with higher values being more zoomed in
// Coordenadas iniciales en Manizales, Caldas, Colombia.
const map = L.map('map').setView([5.0513852, -75.4847779], 9);

// Adds the basemap tiles to your web map
// Additional providers are available at: https://leaflet-extras.github.io/leaflet-providers/preview/
// Template basico
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 21
}).addTo(map);

// @desc Agregamos los pines en el mapa de Leaflet, incluyendo el label de distancia y la linea conectandolos.
function addPins(direccion1, direccion2, distancia) {
	//Limpiamos el mapa antes de la siguiente consulta. 
	// https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet
	map.eachLayer((layer) => {
		if (layer['_latlng'] != undefined)
			layer.remove();
	});

	let dir1GEO = direccion1.coordinates;
	let dir2GEO = direccion2.coordinates;

	//Se crean y se agregan los marcadores sobre las direcciones ingresadas como parametro. 
	let marcador1 = L.marker(dir1GEO).addTo(map);
	let marcador2 = L.marker(dir2GEO).addTo(map);

	// Creamos la linea conectando los puntos, ademas un tooltip para mostrar la distancia. 
	let linea = L.polygon([dir1GEO, dir2GEO]).bindTooltip(distancia, {
		permanent: true,
		direction: "center"
	}).addTo(map);

	// Definimos los limites automaticos para que se haga zoom al definir los marcadores. 
	let limites = L.latLngBounds([dir1GEO, dir2GEO]);
	map.fitBounds(limites);
};

// @desc Guardamos historial y pintamos los marcadores
async function calcularDistancia(e) {
	// Prevenimos que nos mande a otra url.
	e.preventDefault();
	//Validacion de campos.
	if (inputDir1.value === '' || inputDir2.value === '') {
		alert("Por favor llene ambas direcciones...");
		return;
	}

	//Preparamos el cuerpo del request para enviar.
	const sendBody = {
		direccion1: inputDir1.value,
		direccion2: inputDir2.value
	}

	try {
		//Definimos el request del POST
		const publicarHistorial = await fetch('/api/historial', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sendBody)
		});
		//Manejamos los errores que definimos en la creacion de la API.
		if (publicarHistorial.status == 500) {
			throw Error('No se pudo encontrar alguna de las direcciones...');
		}

		//Tomamos la informacion de respuesta con las direcciones en geojson y la distancia calculada.
		const respuesta = await publicarHistorial.json();
		const dir1 = respuesta.data.direccion1GEO;
		const dir2 = respuesta.data.direccion2GEO;
		const dist = `${respuesta.data.distancia} KM`;

		//Llamamos a la funcion anterior a introducir los pines.
		addPins(dir1, dir2, dist);

	} catch (error) {
		alert(error.message);
		return;
	}

}

//Creamos el event listener para ejecutar las funciones onSubmit.
formulario.addEventListener('submit', calcularDistancia);
async function getHistorial() {
	const res = await fetch('/api/historial');
	const response = await res.json();

	//Preparamos la insercion de los componentes de la tabla
	document.getElementById('tabla-historial').innerHTML = '';
	let index = 1;
	response.data.forEach((item) => {
		let html = `
			<tr>
                <th scope="row">${index}</th>
                <td>${item.creacion}</td>
                <td>${item.direccion1}</td>
                <td>${item.direccion2}</td>
                <td>${item.distancia} KM</td>
              </tr>
		`;
		document.getElementById('tabla-historial').innerHTML += html;
		index++;
	});
};

getHistorial();
// Initialize the map and set its view to a chosen geographical coordinates and a zoom level
var map = L.map('map', {
  minZoom: 6,  // Restrict zooming out
  maxZoom: 16}).setView([40.08, -3.87], 6); // Default location (Madrid)

// Add a tile layer (map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Bounds of the map
var bounds = [[35.75, -17.51], [44.144, 9.716]]; 
map.setMaxBounds(bounds);

// Bounce if out
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: true });
});


var marker = null;



var circle;
var radius=80000;
var lista_markers_antiguos = [];


function get_water_levels(embalse_id) {
    // todo
}



/*function filter_current_water(current_water, lista_embalses) {
    
    // TODO TODO TODO
    
    var lista_emb_filtrada = [];
    for (let i = 0; i < lista_embalses.length; i++){
        if (lista_embalses[i]. == isElectric){
            lista_emb_filtrada.push(lista_embalses[i])
        }else{
                break;
        }
    }
return lista_emb_filtrada;
}*/


function filter_electricity(isElectric, lista_embalses) {
    var lista_emb_filtrada = [];
    for (let i = 0; i < lista_embalses.length; i++){
        if (lista_embalses[i].electricoFlag == isElectric){
            lista_emb_filtrada.push(lista_embalses[i])
        }else{
                break;
        }
    }
return lista_emb_filtrada;
}


function filter_min_cap(min_cap, lista_embalses) {
    var lista_emb_filtrada = [];
    for (let i = 0; i < lista_embalses.length; i++){
        if (lista_embalses[i].aguaTotal > min_cap){
            lista_emb_filtrada.push(lista_embalses[i])
        }else{
                break;
        }
    }
return lista_emb_filtrada;
}

function filter_max_cap(max_cap, lista_embalses) {
    var lista_emb_filtrada = [];
    for (let i = 0; i < lista_embalses.length; i++){
        if (lista_embalses[i].aguaTotal < max_cap){
            lista_emb_filtrada.push(lista_embalses[i])
        }else{
                break;
        }
    }
return lista_emb_filtrada;
}



function filterLocation(radio, lista_embalses){
var lista_emb_filtrada = [];
for (let i = 0; i < lista_embalses.length; i++){
    if (lista_embalses[i].distance < radio){
        lista_emb_filtrada.push(lista_embalses[i])
    }else{
            break;
    }
    }
return lista_emb_filtrada;
  
}   


function limpiar_embalses(lista_embalses_antiguos) {
    for(let embalse = 0; 
        embalse < lista_embalses_antiguos.length; ++embalse) {
        map.removeLayer(lista_embalses_antiguos[embalse]);
    }
}

async function peticion_data_embalse(id){
    
    var URL_dist = 'https://malackhatonbackend-gueucxcybseva4dd.spaincentral-01.azurewebsites.net/embalse?';
    
    URL_dist = URL_dist +"id=" + id;
    
    try{
        const resp = await fetch(URL_dist);
        var data = await resp.json();
        console.log(data);
        return data;
    }catch(error){
        console.error('Hubo un problema con la petición Fetch:', error);
    }
}

async function peticion_embalses_ordenados(x, y){
    
    var arrayDatos = [];
    var URL_dist = 'https://malackhatonbackend-gueucxcybseva4dd.spaincentral-01.azurewebsites.net/embalses?';
    
    URL_dist = URL_dist + 'x=' + x + '&y=' + y;
    
    try{
        const resp = await fetch(URL_dist);
        var data = await resp.json();
        
        return Array.isArray(data) ? data : data.items;
    }catch(error){
        console.error('Hubo un problema con la petición Fetch:', error);
    }
}

function update_embalses_dibujados(radio, lista_embalses_ord){
       
    
lista_filtrada = filterLocation(radio, lista_embalses_ord);

var max_cap = document.getElementById("max_cap").value;
if (max_cap == "") max_cap = 999999;
var min_cap = document.getElementById("min_cap").value;
if (min_cap == "") min_cap = 0;
var current_water = document.getElementById("current_water").value;
if (current_water == "") current_water = 0;
var electricity = document.getElementById("is_electric").value;
    
    
//lista_filtrada = filter_max_cap(max_cap, lista_filtrada);
//lista_filtrada = filter_min_cap(min_cap, lista_filtrada);
//lista_filtrada = filter_electricity(electricity, lista_filtrada);
    
//lista_filtrada = filter_current_water();
    
lista_markers = []
for(let embalse = 0; embalse < lista_filtrada.length; embalse++){
    
    var marker_embalse = L.marker([lista_filtrada[embalse].location.x,lista_filtrada[embalse].location.y]).addTo(map);
    
    marker_embalse.bindTooltip(lista_filtrada[embalse].name);
    
    lista_markers.push(marker_embalse);
    
    
    marker_embalse.on('click', function (){
        var myModal = new bootstrap.Modal(document.getElementById('modal-1'));
        peticion_data_embalse(lista_filtrada[embalse].id).then(datos =>
                                                              {
        document.getElementById('res-name').textContent = datos.name;
        
        document.getElementById('titular').textContent = datos.ccaa;

        document.getElementById('ambito').textContent = datos.cauce;
        
        document.getElementById('provincia').textContent = datos.provincia;
        
        document.getElementById('capacidad').textContent = datos.aguaTotal+" hm3"; // cambiar
        
        document.getElementById('electricidad').textContent = datos.electricoFlag? "Si" : "No";
            
        }).catch(error =>
                {
            console.log(error);
        });
        
        
        var water_levels = [];
        water_levels = get_water_levels(lista_filtrada[embalse].id);
        /*var chart = document.querySelector(".water-l-c").chart;
        chart.data.dataset[0].data[0] = 777;
        chart.update();*/
        
/*        // Function to update chart data
        function updateChartData(newLabels, newData) {
            myChart.data.labels = newLabels; // Update labels
            myChart.data.datasets[0].data = newData; // Update data
            myChart.update(); // Refresh the chart
        } */    
        
        
        myModal.show();
    });
    
}
    return lista_markers;
}



let counter = 0;
// Event Listener
function onMapClick(e) {

    counter++;
    if(counter==5){
        //document.body.style.overflow = 'hidden';
        document.getElementById('overlay').style.display = 'block';
        loadHcaptcha();
        // Show the overlay to block interaction
    }
    
    var lat = 40;
    var lng = 0;
    var latlng = e.latlng;
    document.getElementById('coordinates').innerHTML = "Latitude: " +   latlng.lat + ", Longitude: " + latlng.lng;
    
    lat = latlng.lat;
    lng = latlng.lng;
    
    if (marker != null) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }
    
    circle = L.circle([latlng.lat, latlng.lng], {
     color: 'blue',
     fillColor: '#1e90ff',
     fillOpacity: 0.5,
     radius: radius 
    }).addTo(map);
    
    document.getElementById('radiusSlider').addEventListener('input', function(e) {
        var newRadius = e.target.value; // Get new radius from slider
        circle.setRadius(newRadius); // Update the circle radius
        radius = newRadius;
  // Update the displayed radius value
        document.getElementById('radiusValue').innerText = newRadius/1000;
         //TODO
            //peticion_embalses_ordenados(lat, lng).then(response =>{
                //lista_ord = response;
                limpiar_embalses(lista_markers_antiguos);
                lista_markers_antiguos = update_embalses_dibujados(radius/100000, lista_ord);
        //})
        //.catch(error =>{
                //console.log(error);
            //});
       
         //change list up here
});
    
  // Create a new marker at the clicked coordinates and add it to the map
    peticion_embalses_ordenados(lat, lng).then(response =>{
    lista_ord = response;
    limpiar_embalses(lista_markers_antiguos);
    lista_markers_antiguos = update_embalses_dibujados(radius/100000, lista_ord);
    })        .catch(error =>{
                console.log(error);
            });
    marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
}

// Bind click event to map
map.on('click', onMapClick);
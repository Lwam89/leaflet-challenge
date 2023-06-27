//Define variables for tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//Only one base layer can be shown at a time.
let baseMaps = {
    Street: street,
    Topographic: topo
};

// Creating the map object
let EarthQuakeMap_2 = L.map("map", {
    center: [34.8812, 14.153],
    zoom: 2,
    layers: street
});

// Use this link to get the GeoJSON data.
let url_tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Getting our GeoJSON data
let polygons_layers = L.geoJson().addTo(EarthQuakeMap_2);

d3.json(url_tectonic).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    polygons_layers.addData(data.features);
    polygons_layers.setStyle({color: "yellow", fill: 0})
});

let url_earthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create legend to show earthquake depth
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "Earthquake<br>";
    div.innerHTML += "Depth(km)<br>";
    div.innerHTML += '<i style="background: #FEB24C"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: #FD8D3C"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #FC4E2A"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #E31A1C"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #BD0026"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: #7a0177"></i><span>90+</span><br>'
    return div;
};

legend.addTo(EarthQuakeMap_2)

// create a function for set colours for circle markers
function circle_fillcolor (data) {
    let circle_fillColor = ''
    if (data <= 10 & data > -10) {
        circle_fillColor = '#FEB24C';
        }
    else if (data <= 30 & data > 10) {
        circle_fillColor = '#FD8D3C';
        }
    else if (data <= 50 & data > 30) {
        circle_fillColor = '#FC4E2A';
        }
    else if (data <= 70 & data > 50) {
        circle_fillColor = '#E31A1C';
        }
    else if (data <= 90 & data > 70) {
        circle_fillColor = '#BD0026';
        }
    else if (data > 90) {
        circle_fillColor = '#7a0177';
    };
    return circle_fillColor
}

let circle_layers = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag^10,  // set the radius of the circle marker
            fillColor: circle_fillcolor(feature.geometry.coordinates[2]), // set the colors of the circle marker
            color: circle_fillcolor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup('<p>'+"Magnitude: "+feature.properties.mag+'</p>'
                        + '<p>'+ "Coordinates: "+feature.geometry.coordinates+'</p>');
    }
})

d3.json(url_earthquake).then(function(data) {

        circle_layers.addData(data.features);
})

let overlayMaps = {
    Tectonic_Plates: polygons_layers,
    Earthquakes: circle_layers
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(EarthQuakeMap_2);
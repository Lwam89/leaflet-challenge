// Creating the map object
let EarthQuakeMap = L.map("map", {
  center: [34.8812, 14.153],
  zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(EarthQuakeMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Creating a new marker:
// We pass in some initial options, and then add the marker to the map by using the addTo() method.
d3.json(link).then(function(data) {

    for (let i = 0; i < data.features.length; i++) {

        let earthquake_lan = data.features[i].geometry.coordinates[1];
        let earthquake_lon = data.features[i].geometry.coordinates[0];
        let earthquake_mag = data.features[i].properties.mag;
        let earthquake_depth = data.features[i].geometry.coordinates[2]

        let circle_fillColor = [];
        let circle_radius = 30000 * earthquake_mag;

        if (earthquake_depth <= 10 & earthquake_depth > -10) {
            circle_fillColor = '#FEB24C';
            }
        else if (earthquake_depth <= 30 & earthquake_depth > 10) {
            circle_fillColor = '#FD8D3C';
            }
        else if (earthquake_depth <= 50 & earthquake_depth > 30) {
            circle_fillColor = '#FC4E2A';
            }
        else if (earthquake_depth <= 70 & earthquake_depth > 50) {
            circle_fillColor = '#E31A1C';
            }
        else if (earthquake_depth <= 90 & earthquake_depth > 70) {
            circle_fillColor = '#BD0026';
            }
        else if (earthquake_depth > 90) {
            circle_fillColor = '#7a0177';
        };

        let circles = L.circle([earthquake_lan, earthquake_lon], {
            color: circle_fillColor,
            weight: 2,
            fillColor: circle_fillColor,
            fillOpacity: 0.8,
            radius: circle_radius,
        }).addTo(EarthQuakeMap);

        let paragraphs = '<p>' + "Magnitude: " + earthquake_mag +'</p>'
                + '<p>'+ "Coordinates: " + earthquake_lan + "," + earthquake_lon + '</p>'
                + '<p>'+ "Earthquake Depth: " + earthquake_depth + "km" + '</p>';

        circles.bindPopup(paragraphs);
    };
});

// create legend
// var getColor = ["#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026","#7a0177"];

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

legend.addTo(EarthQuakeMap)
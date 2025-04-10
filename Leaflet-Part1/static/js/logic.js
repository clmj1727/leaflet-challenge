// create the tile layer for the backgrounds of the map
var defaultMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//terrain layer
var terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//make basemaps object
let basemaps = {
    Terrain: terrain,
    Default: defaultMap
};


// make a map object
var myMap = L.map("map",{
    center: [37.8, -96],
    zoom: 4.5,
    layers: [terrain, defaultMap]
});

//add default map to the map
defaultMap.addTo(myMap);

//get the data for the tectonic plates and draw on the map
//variable to hold tectonic plates layer
let tectonicplates = new L.layerGroup();

//call the api to the get the info for the tectonic paltes
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/refs/heads/master/GeoJSON/PB2002_plates.json")
.then(function(plateData){
    //console log to make sure the data loads
    //console.log(plateData);

    //load data using geoJson and add to the tectonic plates layer group
    L.geoJson(plateData,{
        //add styling
        color:"red",
        weight: 1
    }).addTo(tectonicplates)
});

//add tectonic plates to the map
//tectonicplates.addTo(myMap);

//variable to hold tectonic plates layer
let earthquakes = new L.layerGroup();

//call api for info on earthquakes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(function(earthquakeData){
    //console log to make sure the data loads
    //console.log(earthquakeData);
    //plot circles where the radius is dependent on
    //color dependent on depth

    //fx that chooses color
        function dataColor(depth){
            if (depth > 90)
                    return "red";
            else if (depth > 70)
                    return "#fc4902";
            else if (depth > 50)
                    return "#fc8404";
            else if (depth > 30)
                    return "#fcad02";
            else if (depth > 10)
                return "#cafc04";
            else   
                return "green";
        }
    
    //fx determining size of radius
        function radiusSize(mag){
                if (mag == 0)
                        return 1; //makes sure that 0 mag shows up
                else
                    return mag * 5; //makes sure circle is pronounced
        }

    //add style for each data point
        function dataStyle(feature)
        {
            return {
                opacity: 1,
                fillOpacity: 0.5,
                fillColor: dataColor(feature.geometry.coordinates[2]), //use index 2 for depth
                color: "000000", //black outline
                radius: radiusSize(feature.properties.mag), //grabs magnitude
                weight: 0.5
            }
        }
    //add geoJson data
        L.geoJson(earthquakeData, {
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng){
                return L.circleMarker(latLng);    
            },
            //set style for each marker
            style: dataStyle, //calls data style fx
            //add popups
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                Location: <b>${feature.properties.place}</b>`);
            }
        }).addTo(earthquakes);
}
);

//add the earthquake layer to the map
earthquakes.addTo(myMap);

//add overlay for the tectonic plates and for earthquakes
let overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes
};

    // Add the layer control
    L.control
        .layers(basemaps, overlays)
        .addTo(myMap);

    // Inject CSS for legend styling
    const legendStyles = `
        .legend {
            background: white;
            padding: 10px;
            line-height: 18px;
            color: #333;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            font-size: 14px;
        }

        .legend i {
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
            display: inline-block;
        }
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = legendStyles;
    document.head.appendChild(styleElement);

    // Create the legend control
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let intervals = [-10, 10, 30, 50, 70, 90];
        let colors = ["green", "#cafc04", "#fcad02", "#fc8404", "#fc4902", "red"];

        for (var i = 0; i < intervals.length; i++) {
            div.innerHTML +=
                "<i style='background:" + colors[i] + "'></i> " +
                intervals[i] +
                (intervals[i + 1] ? "km &ndash; " + intervals[i + 1] + "km<br>" : "+");
        }

        return div;
    };

    legend.addTo(myMap);

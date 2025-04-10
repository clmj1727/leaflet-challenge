// create the tile layer for the backgrounds of the map
var defaultMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//grayscale layer
var grayscale = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

//terrain layer
var terrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

//make basemaps object
let basemaps = {
    GrayScale: grayscale,
    Terrain: terrain,
    Default: defaultMap
};


// make a map object
var myMap = L.myMap("map",{
    center: [36.7783,  119.4179],
    zoom: 5,
    layers: [grayscale, terrain, defaultMap]
});

//add default map to the map
defaultMap.addTo(myMap);

//add control layer
L.control().layers(basemaps).addTo(myMap)

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
tectonicplates.addTo(myMap);

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
                fillColor: dataColor(feature.geometry.coorinates[2]), //use index 2 for depth
                color: "000000", //black outline
                radius: radiusSize(feature.property.mag), //grabs magnitude
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
                layer.blindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                Location: <b>${feature.properties.place}</b>`);
            }
        }.addTo(earthquakes))
    }
);

//add the earthquake layer to the map
earthquakes.addTo(myMap);

//add overlay for the tectonic plates and for earthquakes
let overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes
};

//add the layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);

//add the legend
let legend = L.control(
   {
    position: "bottomright"
   });

// add properties to legend
legend.onAdd = function () {
    //div for legend to appear
    let div = L.DomUtil.create("div", "info legend");

    // set up
    let intervals = [-10, 10,30,50, 70, 90];

    //set the colors for int"ervals
    let colors = ["green", "#cafc04", "#fcad02", "#fc8404", "#fc4902", "red"];

    // loop thorugh intervals and colors, to generate label
    for(var i = 0; i <intervals.length; i++)
    {
        //inner html that sets square for each interval and label
        div.innerHTML += "<i style = `background: "
            + colors[i]
            + "<></i>"
            + intervals[i]
            + (intervals[i + 1] ? "km &ndash km;" + intervals[i + 1] + "km<br>" : "+");
    }

    return div;
};
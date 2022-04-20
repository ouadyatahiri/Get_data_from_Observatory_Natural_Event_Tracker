//Initialize the map :
var map =L.map('map').setView([0,0],2);
var basicTile =L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
{
    attribution: '&copy; By Ouadyâ Tahiri',
    subdomains: "abc",
    maxZoom: 19,
    minZoom :2
}
).addTo(map);
var layers =L.layerGroup().addTo(map);

//Get Json data from NASA server :
async function getData(){
  //the getData it's an asynchronous function , it takes time to get data from the server.
    let response =await fetch("https://eonet.gsfc.nasa.gov/api/v2.1/events");
  //response variable will receive the promise as value
    let data = await response.json();
  //Then we convert the promise into a json file using json() method .
    data.events.forEach(event => {
  //data variable contains  the json file composed of a set of events   , we use forEach to iterate over the events array
      event.geometries.forEach(element=>{
  //We iterate for a second time over the geometries because it's also a set of objects.
        let marker =L.marker(element.coordinates.reverse()).addTo(layers).bindPopup(
          //Then we create a set of markers each one refers to a specific event
          //We assign the markers into the layerGroup to control it well .
          //Then we assign a popup to each marker using bindPopup () method 
          "<p>Title :"+event.title+"</p>"+
          "<p>Date :"+element.date+"</p>"+
          "<p>Categorie :"+event.categories[0].title+"</p>"
        );
      })
    
      
    });
}
getData();


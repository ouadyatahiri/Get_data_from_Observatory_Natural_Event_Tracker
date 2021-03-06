//Initialize the map :
var map =L.map('map').setView([0,0],1);
var basicTile =L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
{
    attribution: '&copy; By Ouadyâ Tahiri',
    subdomains: "abc",
    maxZoom: 19,
    minZoom :2
}
).addTo(map);
//Add a container for the layers  
var layers =L.layerGroup().addTo(map);
//Get the selected radio option's value
var selectedEvent='';
$(function (){
  let wildfires =$('#wildfires');
  let volcanoes =$('#volcanoes');
  let sal =$('#sal');
  let all =$('#all');
  wildfires.click(
    ()=>{
      selectedEvent =wildfires.val();
      layers.clearLayers();
      visualizeData(data.events.filter(event=>event.categories[0].title==selectedEvent));
    }
  );
  volcanoes.click(
    ()=>{
      selectedEvent =volcanoes.val();
      layers.clearLayers();
      visualizeData(data.events.filter(event=>event.categories[0].title==selectedEvent));
    }
  );
  sal.click(
    ()=>{
      selectedEvent =sal.val();
      layers.clearLayers();
      visualizeData(data.events.filter(event=>event.categories[0].title==selectedEvent));
    }
  );
  all.click(
    ()=>{
      layers.clearLayers();
      visualizeData(data.events);
    }
  )
  
})
var data='';
//Get data :
async function getData(){
  //the getData it's an asynchronous function , it takes time to get data from the server.
    let response =await fetch("https://eonet.gsfc.nasa.gov/api/v3/events");
  //response variable will receive the promise as value
  //convert the promise into a json file using json() method .
    data = await response.json();
    //Let's reverse the coordinates array:
    data.events.forEach(event=>event.geometry.forEach(element=>element.coordinates.reverse()));
    //After getting the data let's visualize it :
    visualizeData(data.events);
}
getData();
//Now let's go far with this code and build a simple app that filter JSON data, based on some caractrestics such as title , categories and so on
var description =L.control(
  {
    position :'topleft'
  }
);
function addDescription(){
  let div=L.DomUtil.create('div','description');
  div.innerHTML='<h3>The Earth Observatory Natural Event Tracker</h3>'+'<br>'+
  '<p>EONET is a repository of metadata about natural events.It\'s accessible '+
  'via web services.It will drive your natural event application. </p>'+'<br>'+
  '<p>Select a natural event category :</p>'+
  '<div >'+
    '<input type="radio" id="wildfires" value="Wildfires" name="event">'+
    '<label for="wildfires">Wildfires</label>'+'<br>'+
    '<input type="radio" id="volcanoes" value="Volcanoes" name="event">'+
    '<label for="Volcanoes">Volcanoes</label>'+'<br>'+
    '<input type="radio" id="sal" value="Sea and Lake Ice" name="event">'+
    '<label for="sal">Sea and Lake Ice</label>'+'<br>'+
    '<input type="radio" id="all" value="all" name="event">'+
    '<label for="sal">Display All</label>'+
'</div>'
  return div;
}
description.onAdd=addDescription;
description.addTo(map);

// visualizeDataing:
 function visualizeData(data_){
  data_.forEach(event => {
    //data variable contains  the json file composed of a set of events   , we use forEach to iterate over the events array
        event.geometry.forEach(element=>{
          //We iterate for a second time over the geometry because it's also an array of objects.
                let circlemarker =L.circleMarker(element.coordinates,
                {
                  radius :5,color :(event.categories[0].title=='Wildfires')?'orange':(event.categories[0].title=='Volcanoes')?'green':'aqua'
                   ,fillColor :(event.categories[0].title=='Wildfires')?'orange':(event.categories[0].title=='Volcanoes')?'green':'aqua'
              }
                ).addTo(layers).bindPopup(
                  //Then we create a set of markers each one refers to a specific event
                  //We assign the markers into the layerGroup to control it well .
                  //Then we assign a popup to each marker using bindPopup () method 
                  "<p>Title :"+event.title+"</p>"+
                  "<p>Date :"+element.date+"</p>"+
                  "<p>Categorie :"+event.categories[0].title+"</p>"
                );
              });
});
}

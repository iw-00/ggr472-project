/*------------------------------------------------------------------------------
GGR472 Lab 3: Adding styling and interactivity to web maps with JavaScript.
--------------------------------------------------------------------------------*/

// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

const map = new mapboxgl.Map({
    container: 'map',
    projection: 'mercator',
    style: "mapbox://styles/iw00/cm7v16zql01tr01qo6qk93q42",
    center: [2.340180, 26.389773], 
    zoom: 1.8
  });

// Add zoom and rotation controls to the top left
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option
map.addControl(new mapboxgl.FullscreenControl());

// Create geocoder as a variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

// Append geocoder variable to goeocoder HTML div to position on page
document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

  // add function to the return button with flyto, bringing us back to our original zoom and center point
document.getElementById('returnbutton').addEventListener('click', () => {
  map.flyTo({
      center: [3.703304, 37.708399],
      zoom: 5,
      essential: true
  });
});

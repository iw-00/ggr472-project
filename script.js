/*------------------------------------------------------------------------------
GGR472 Lab 3: Adding styling and interactivity to web maps with JavaScript.
--------------------------------------------------------------------------------*/

// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

const map = new mapboxgl.Map({
    container: 'map',
    projection: 'naturalEarth',
    style: "mapbox://styles/iw00/cm7v16zql01tr01qo6qk93q42"
  });


  // add function to the return button with flyto, bringing us back to our original zoom and center point
document.getElementById('returnbutton').addEventListener('click', () => {
  map.flyTo({
      center: [-79.347212, 43.720271],
      zoom: 10,
      essential: true
  });
});

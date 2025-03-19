/*------------------------------------------------------------------------------
GGR472 Project: 
--------------------------------------------------------------------------------*/

// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

// Create map
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

// Add data layers to map.
// ------------------------------------------------------------
map.on("load", () => {

  // Add source for show data
  map.addSource("show-data", {
      type: "geojson",
      data: "https://raw.githubusercontent.com/iw-00/ggr472-project/refs/heads/main/data/shows.geojson"
  });

  // Add stadium points to map
  map.addLayer({
        id: "show-pts",
        type: "circle",
        source: "show-data",
        paint: {
            "circle-radius": 4,
            "circle-color": "#1ff258"
        }
    });
});

// Add button to return to full extent.
// ------------------------------------------------------------

  // add function to the return button with flyto, bringing us back to our original zoom and center point
document.getElementById('returnbutton').addEventListener('click', () => {
  map.flyTo({
      center: [2.340180, 26.389773],
      zoom: 1.8,
      essential: true
  });
});

// Add pop-ups.
// ------------------------------------------------------------

// Switch cursor to pointer when mouse is over litter bin point layer.
map.on("mouseenter", "show-pts", () => {
  map.getCanvas().style.cursor = "pointer";
});

// Switch cursor back when mouse leaves layer.
map.on("mouseleave", "show-pts", () => {
  map.getCanvas().style.cursor = ""; // Switch cursor back when mouse leaves litter bins layer
});

map.on("click", "show-pts", (e) => {
  new mapboxgl.Popup() // Declare new popup object on each click
      .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
      .setHTML(e.features[0].properties.venue + "<br>" +
          "City: " + e.features[0].properties.city) // Use click event properties to write text for popup
      .addTo(map); // Show popup on map
});
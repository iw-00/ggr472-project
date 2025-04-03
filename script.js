/*---------------------------
INITIALIZE MAP
---------------------------*/

mapboxgl.accessToken = "pk.eyJ1Ijoic3RhbmZvcmRjaGFuZyIsImEiOiJjbTVvZHBxOHUwa3p2Mmxwbm90N2I0MzZqIn0.JfQLnEhITEAZl2kHoQP7rA"; // Mapbox access token

// Create map
const map = new mapboxgl.Map({
    container: 'map',
    projection: 'mercator',
    style: "mapbox://styles/stanfordchang/cm8kr9l8600rp01ry7b712acl", // custom style URL (Monochrome)
    center: [2.340180, 26.389773], // starting location
    zoom: 1.3 // starting zoom level
});

/*---------------------------
MAP CONTROLS
---------------------------*/

// Add navigation and fullscreen controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

// Create geocoder as a variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

// Append geocoder variable to geocoder HTML div to position on page
document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

/*---------------------------
VISUALIZE DATA
---------------------------*/
function visualizeData() {

    // Add source for show data
    map.addSource("show-data", {
        type: "geojson",
        data: "https://iw-00.github.io/ggr472-project/data/shows.geojson"
    });

    // Add stadium points to map
    map.addLayer({
        id: "show-pts",
        type: "circle",
        source: "show-data",
        paint: {
            "circle-radius": [
              "step",
              ["get", "shows"],
              3,
              1, 3,
              2, 4,
              3, 6,
              4, 8,
              5, 10
            ],
            "circle-color": "#5B1166"
        }
    });
}

map.on("load", () => {
    visualizeData()
});

/*---------------------------------------
BUTTON: RETURN TO FULL EXTENT & EXIT MAP
-----------------------------------------*/

document.getElementById('returnbutton').addEventListener('click', () => {
    map.jumpTo({
      center: [2.340180, 26.389773],
      zoom: 1.0, // Reset to original zoom
      pitch: 0, // Reset to original pitch
      bearing: 0, // Reset to original rotation
      essential: true
    });
});

// Add function to the return button with jumpTo, bringing us back to our original zoom and center point
document.getElementById('exitbutton').addEventListener('click', () => {
    map.jumpTo({
      center: [2.340180, 26.389773],
      zoom: 1.0, // Reset to original zoom
      pitch: 0, // Reset to original pitch
      bearing: 0, // Reset to original rotation
      essential: true
    });

    // Re-enable user interaction
    map.scrollZoom.enable();
    map.boxZoom.enable();
    map.dragPan.enable();
    map.dragRotate.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();

    map.setStyle('mapbox://styles/stanfordchang/cm8kr9l8600rp01ry7b712acl'); // Change map style back to default

    // Load sources and layers that were reset after style is changed
    map.once('style.load', () => {
        visualizeData();
    });

    stopRotation(); // Cancel rotation animation
});

/*---------------------------
MOUSE EVENTS
-----------------------------*/

// When mouse enters a point
map.on("mouseenter", "show-pts", () => {
    map.getCanvas().style.cursor = "pointer"; // Switch cursor to pointer
});

// When mouse leaves a point
map.on("mouseleave", "show-pts", () => {
    map.getCanvas().style.cursor = ""; // Switch pointer to cursor
});

// When mouse clicks a point
map.on("click", "show-pts", (e) => {
    const coordinates = [e.features[0].properties.lng, e.features[0].properties.lat] // Retrieve coordinates of point
    const properties = e.features[0].properties; // Retrieve properties of the clicked point


    // Move camera to clicked point
    map.flyTo({
      center: coordinates,
    });

    const buttonID = e.features[0].id // Retrieve ID of point for popup button

    const description = `
      <div>
        <h5>${e.features[0].properties.city}, ${e.features[0].properties.country}</h5>
        <p>${e.features[0].properties.dates}</p>
        <button type="button" class="btn btn-outline-info" id="${buttonID}">Go to ${e.features[0].properties.venue}</button>
      </div>
    `;

    // Create and show popup
    new mapboxgl.Popup() // Declare new popup object on each click
      .setLngLat(coordinates) // Set popup location to point location
      .setHTML(description)
      .addTo(map); // Show popup on map

    // Attach an event listener after the popup is added to the map
    setTimeout(() => {
    const stadiumbtn = document.getElementById(buttonID);
    if (stadiumbtn) {
        stadiumbtn.addEventListener("click", () => {
        // Jump to the stadium
        map.jumpTo({
            center: coordinates,
            zoom: 17, // Zoom in to the stadium
            pitch: 65 // Pitch the camera to show 3D buildings
        });

        // Start continuous rotation animation
        startRotation(map);

        map.setStyle('mapbox://styles/stanfordchang/cm8gipc43015j01s52jfo9p21'); // Change map style (Mapbox Standard)

        // Hide stadium points
        map.setLayoutProperty('show-pts', 'visibility', 'none');

      });
    }
    }, 0);
     // Update the 'show-info' div with data from the properties
     const showInfoDiv = document.getElementById("show-info");
     if (showInfoDiv) {
       // Clear any existing content
       showInfoDiv.innerHTML = "";

       // Add content dynamically
       const cityCountry = `<h3>${properties.city}, ${properties.country}</h3>`;
       const venue = `<p><strong>Venue:</strong> ${properties.venue || "N/A"}</p>`;
       const dates = `<p><strong>Dates:</strong> ${properties.dates || "N/A"}</p>`;
       const opener = `<p><strong>Opening acts:</strong> ${properties.opener || "N/A"}</p>`;

       // Handle surprise songs (check if they are arrays or strings)
       const guitarSongs = Array.isArray(properties["guitar-surprise-song"])
           ? properties["guitar-surprise-song"].join(", ")
           : properties["guitar-surprise-song"] || "N/A";

       const pianoSongs = Array.isArray(properties["piano-surprise-song"])
           ? properties["piano-surprise-song"].join(", ")
           : properties["piano-surprise-song"] || "N/A";
        
       const surpriseSongs = `<p><strong>🎸 Guitar surprise songs: </strong>${guitarSongs}, <br><br><strong>🎹 Piano surprise songs:</strong> ${pianoSongs}</p>`;

       const tiktokEmbed = `${properties.tiktok || ""}`;

       // Combine all content and update the div
       showInfoDiv.innerHTML = cityCountry + venue + dates + opener + surpriseSongs + tiktokEmbed;
    };
});

/*---------------------------
FUNCTION: ROTATE MAP
-----------------------------*/

let rotationTimeout = null;

// Function to start rotation
function startRotation() {

    // Disable user interaction
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    // Rotate function
    function rotate() {
      const currentZoom = map.getZoom(); // Check current zoom level
      
      // Only continue rotating if zoom level is equal or greater than 17
      if (currentZoom >= 17) {
          const currentBearing = map.getBearing();
          
          map.easeTo({
            bearing: currentBearing + 120, // Rotate 120 degrees
            duration: 5000, // For 5 seconds
            easing: (t) => t // Linear easing
          });
        
          rotationTimeout = setTimeout(rotate, 5000); // Start next segment when animation is done
          
        } 
        else {
          stopRotation(map); // Stop rotation
        }
    }
    
    // Run rotate function again
    rotate();
}

// Function to stop rotation
function stopRotation() {
    if (rotationTimeout) {
      clearTimeout(rotationTimeout);
      rotationTimeout = null;
    }
    
    map.stop(); // Stop any active camera animations
}

/*---------------------------
FILTER BY OPENING ACT
-----------------------------*/

let selectedOpener;

document.getElementById("openers").addEventListener("change",(e) => {   
  selectedOpener = document.getElementById("openers").value; // get selected opener value

  console.log(selectedOpener);

  if (selectedOpener == 'All') {
    map.setFilter(
        'show-pts', null); // show all points
  } else {
    map.setFilter(
        'show-pts',
        ['in', selectedOpener, ['get', 'opener']] // return points with opener that matches dropdown selection
    );
  }
});

/*---------------------------
SEARCH BY SURPRISE SONG
-----------------------------*/

// Add search functionality to dropdown
$(document).ready(function() {
  $('.js-example-basic-single').select2();
});

$(function(){
  // Turn the element to select2 select style
  $('.js-example-basic-single').select2({
    placeholder: "Search for a song (e.g., Maroon)"
  });

  $('.js-example-basic-single').on('change', function() {
    var selectedSong = $(".js-example-basic-single option:selected").text();
    $("#test").val(selectedSong);
    console.log(selectedSong);

    if (selectedSong == 'All') {
      map.setFilter(
          'show-pts', null); // show all points
    } else {
      map.setFilter(
          'show-pts',
          ["any", ['in', selectedSong, ['get', 'guitar-surprise-song']], ['in', selectedSong, ['get', 'piano-surprise-song']], ['in', selectedSong, ['get', 'mashup-songs']]] // return points with song that matches selection
      );
    }

  })
});

// Search bar functionality
// function myFunction() {
//   var input, filter, ul, li, a, i, txtValue;
//   input = document.getElementById("myInput");
//   filter = input.value.toUpperCase();
//   ul = document.getElementById("myUL");
//   li = ul.getElementsByTagName("li");
//   for (i = 0; i < li.length; i++) {
//       a = li[i].getElementsByTagName("a")[0];
//       txtValue = a.textContent || a.innerText;
//       if (filter && txtValue.toUpperCase().indexOf(filter) > -1) {
//           li[i].style.display = "";
//       } else {
//           li[i].style.display = "none";
//       }
//   }
// }

/*---------------------------
ADDING LEGEND TO MAP VISIBLE ONLY AT FULL EXTENT
-----------------------------*/

const legend = document.getElementById('legend');

const legendLabels = [
  { label: '1 show', size: 3 },
  { label: '2 shows', size: 4 },
  { label: '3 shows', size: 6 },
  { label: '4 shows', size: 8 },
  { label: '5+ shows', size: 10 },
]

    // Loop through the legend labels and create legend items
    legendLabels.forEach((item) => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";

      // Create the circle for the legend
      const circle = document.createElement("div");
      circle.className = "legend-circle";
      circle.style.width = `${item.size * 2}px`; // Adjust size for better visibility
      circle.style.height = `${item.size * 2}px`;
      circle.style.backgroundColor = "#5B1166"; // Match the circle color in the map

      // Add the label
      const label = document.createElement("span");
      label.textContent = item.label;

      // Append the circle and label to the legend item
      legendItem.appendChild(circle);
      legendItem.appendChild(label);

      // Append the legend item to the legend container
      legend.appendChild(legendItem);
  });

/*---------------------------
SET VISIBILITY OF CONTAINERS AT 3D ZOOM AND PITCH 
-----------------------------*/

function checkVisibility() {
  const zoomLevel = map.getZoom();
  const pitchLevel = map.getPitch();

  console.log(`zoom level: ${zoomLevel}, Pitch level: ${pitchLevel}`);

  const searchContainer = document.getElementById('map-search-container');
  const openerDropdown = document.getElementById('opener-dropdown')
  const showInformation = document.getElementById('show-info');
  const songSearch = document.getElementById('song-search');
  const returnButton = document.getElementById('returnbutton');
  const exitButton = document.getElementById('exitbutton');

  if (zoomLevel >= 17 && pitchLevel >=65) {
    console.log('Showing searchContainer and openerDropdown, hiding showInformation');
    searchContainer.style.display = 'none';
    openerDropdown.style.display = 'none';
    showInformation.style.display = 'block';
    songSearch.style.display = 'none';
    legend.style.display = 'none';
    exitButton.style.display = 'block';
    returnButton.style.display = 'none';
  } else {
    console.log('Hiding searchContainer and openerDropdown, showing showInformation');
    searchContainer.style.display = 'block';
    openerDropdown.style.display = 'block';
    showInformation.style.display = 'none';
    songSearch.style.display = 'block';
    legend.style.display = 'block';
    exitButton.style.display = 'none';
    returnButton.style.display = 'block';
  }
}

map.on('zoom', checkVisibility);
map.on('pitch', checkVisibility);

map.on('load', () => {
  checkVisibility();
  visualizeData();
})


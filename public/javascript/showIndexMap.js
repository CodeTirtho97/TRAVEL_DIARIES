mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: [78.8718, 21.7679], // starting position [lng, lat]
  zoom: 4, // starting zoom
});

for (let diary of allDiaries) {
  new mapboxgl.Marker({ color: "#e5383b" })
    .setLngLat(diary.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<a href="/diaries/${diary._id}"><h5>${diary.title}</h5></a>`
      )
    )
    .addTo(map);
}

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

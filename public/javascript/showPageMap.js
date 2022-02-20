mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: diary.geometry.coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});

// new mapboxgl.Marker()
//   .setLngLat(diary.geometry.coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25 }).setHTML(
//       `<h3>${diary.title}</h3><p>${DOMPointReadOnly.location}</p>`
//     )
//   )
//   .addTo(map);

new mapboxgl.Marker({ color: "#e5383b" })
  .setLngLat(diary.geometry.coordinates)
  .addTo(map);

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

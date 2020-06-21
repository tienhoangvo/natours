export const displayMap = (locations) => {
 mapboxgl.accessToken =
  'pk.eyJ1Ijoidm9ob2FuZ3RpZW4iLCJhIjoiY2thd212MjJpMDZ0cDJ6bGk3aW1ldng2bSJ9.qhrY84FnqnmQrNiZmSaDbA';

 var map = new mapboxgl.Map({
  container: 'map',
  style:
   'mapbox://styles/vohoangtien/ckawn1ztl02gp1jpfej66mghh',
  scrollZoom: false,
 });

 const bounds = new mapboxgl.LngLatBounds();

 locations.forEach((loc) => {
  // create marker
  const el = document.createElement('div');

  el.className = 'marker';

  // add marker
  new mapboxgl.Marker({
   element: el,
   anchor: 'bottom',
  })
   .setLngLat(loc.coordinates)
   .addTo(map);

  // Add popup
  new mapboxgl.Popup({
   offset: 30,
  })
   .setLngLat(loc.coordinates)
   .setHTML(
    `<p>Day ${loc.day}: ${loc.description}</p>`
   )
   .addTo(map);

  // extend map bounds to include current location
  bounds.extend(loc.coordinates);

  map.fitBounds(bounds, {
   padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
   },
  });
 });
};

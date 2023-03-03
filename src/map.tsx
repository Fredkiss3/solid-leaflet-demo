import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { createSignal, onMount, onCleanup, createEffect } from "solid-js";

export type Marker = {
  id: number;
  center: L.LatLngTuple;
  geojson: any;
  show: boolean;
};

export function LeafletMap(props: {
  selectedId: number | null;
  markers: Marker[];
  baseId: string;
}) {
  let mapElement: HTMLDivElement | undefined = undefined;
  const [leafletMap, setLeafletMap] = createSignal<L.Map | null>(null);

  onMount(() => {
    // to satisfy typescript
    if (!mapElement) return;

    const bbox = [-4.04668, 5.4293171, -4.04658, 5.4294171];
    const bounds = L.latLngBounds(
      L.latLng(bbox[0], bbox[2]), // minLat, minLong
      L.latLng(bbox[1], bbox[3]) // maxLat, maxLong
    );

    const map = L.map(mapElement)
      // .setView([5.29799, -3.93604])
      .fitBounds(bounds);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/fredkiss3/cky7kyfcw6ydq15l1reh6b92j/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZnJlZGtpc3MzIiwiYSI6ImNsODYxbmZyMTAxNngzcG10ZmwxOGZlcjgifQ.EdlMNFjpETZpBYhUnNjquQ",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(map);

    setLeafletMap(map);
  });

  onCleanup(() => {
    leafletMap()?.remove();
  });

  createEffect(() => {
    if (!leafletMap()) return;

    const popups: L.Popup[] = [];

    for (const marker of props.markers) {
      const element = Marker({ baseId: props.baseId, id: marker.id });

      const popup = L.popup({
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
        closeButton: false,
        className: "marker-popup",
      })
        .setLatLng(marker.center)
        .setContent(element.outerHTML);
      popup.addTo(leafletMap()!);
      popups.push(popup);
    }

    onCleanup(() => {
      popups.forEach((p) => p.remove());
    });
  });

  return (
    <>
      <div ref={mapElement} style="height: 400px; width: 100%"></div>
    </>
  );
}

function Marker({ id, baseId }: { id: number; baseId: string }) {
  return (
    <div class="marker">
      <div class={`marker-price-tag`} id={`${baseId}-${id}`}>
        {id}
      </div>
    </div>
  ) as HTMLDivElement;
}

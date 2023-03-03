import { Component, Show, For, createUniqueId } from "solid-js";
import { createSignal } from "solid-js";
import { LeafletMap } from "./map";
import { points } from "./data";
import type { Marker } from "./map";
import { createStore } from "solid-js/store";

const App: Component = () => {
  const [getSelectedId, setSelectedId] = createSignal<number | null>(null);
  const baseId = createUniqueId();

  const [markers, setMarkers] = createStore<
    (Marker & { selected: boolean; name: string })[]
  >(
    points.map((p) => ({
      id: p.place_id,
      center: [Number(p.lat), Number(p.lon)],
      geojson: p.geojson,
      show: true,
      selected: false,
      name: p.display_name,
    }))
  );

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "start",
        gap: "3px",
        "font-family": "sans-serif",
      }}
    >
      <h1
        style={{
          "font-family": "sans-serif",
        }}
      >
        Leaflet Demo :
      </h1>

      <LeafletMap
        selectedId={getSelectedId()}
        markers={markers}
        baseId={baseId}
      />

      <ul>
        <For each={markers}>
          {(m, getIndex) => (
            <li
              tabindex={0}
              style={{
                cursor: "pointer",
                color: m.selected ? "coral" : "black",
                "text-decoration": m.show ? "none" : "line-through",
              }}
              onMouseEnter={() => {
                setSelectedId(m.id);
                setMarkers(getIndex(), "selected", true);
                const element = document.querySelector(
                  `#${baseId}-${m.id}`
                ) as HTMLElement | null;
                element?.classList.add("selected");
              }}
              onMouseLeave={() => {
                setMarkers(getIndex(), "selected", false);
                const element = document.querySelector(
                  `#${baseId}-${m.id}`
                ) as HTMLElement | null;
                element?.classList.remove("selected");
              }}
              onClick={() => {
                setMarkers(getIndex(), "show", (show) => !show);

                const element = document.querySelector(
                  `#${baseId}-${m.id}`
                ) as HTMLElement | null;

                element?.closest(".marker-popup")?.classList.toggle("hidden");
              }}
            >
              select {m.name}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default App;

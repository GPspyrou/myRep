'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useLoadScript, GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { House } from '@/app/types/house';
import HousePopupCard from '@/app/components/ListingsPageComponents/HousePopupCard';

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

type Props = {
  houses: House[];
  viewState: ViewState;
  selectedHouse: House | null;
  setViewState?: (state: ViewState) => void;
  setSelectedHouse?: (house: House | null) => void;
};

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

const librariesConst = ['places', 'marker'] as const;
const libraries = [...librariesConst];

export default function MapComponent({
  houses,
  viewState,
  selectedHouse,
  setViewState = () => {},
  setSelectedHouse = () => {},
}: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      markersRef.current.forEach(m => { m.map = null; });
      markersRef.current = [];
      clustererRef.current?.clearMarkers();

      const markers = houses
        .map(house => {
          const lat = Number(house.location.latitude),
                lng = Number(house.location.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          // Construct text for marker
          let text = '';
          if (house.bedrooms != null && house.bathrooms != null) {
            text = `${house.bedrooms}BD | ${house.bathrooms}BA | ${house.size} M²`;
          } else {
            text = house.size != null ? `${house.size} M²` : 'No data';
          }

          // Create styled div for marker
           const markerDiv = document.createElement('div');
          Object.assign(markerDiv.style, {
            backgroundColor: '#333',
            color: 'white',
            width: '120px',
            height: '30px',
            borderRadius: '15px',
            border: '1px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          });
          markerDiv.textContent = text;

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content: markerDiv,
            gmpClickable: true,
            title: house.title || '',
          });

          marker.addListener('gmp-click', () => {
            setSelectedHouse(house);
          });

          return marker;
        })
        .filter(
          (m): m is google.maps.marker.AdvancedMarkerElement => m !== null
        );

      markersRef.current = markers;
      clustererRef.current = new MarkerClusterer({ map, markers, renderer: {
        render({ count, position }) {
          const c = document.createElement('div');
          Object.assign(c.style, {
            backgroundColor: '#333',
            color: 'white',
            width: `${20 + count.toString().length * 8}px`,
            height: `${20 + count.toString().length * 8}px`,
            borderRadius: '50%',
            border: '1px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
          });
          c.textContent = String(count);
          return new google.maps.marker.AdvancedMarkerElement({
            position,
            content: c,
          });
        },
      }});
    },
    [houses, setSelectedHouse]
  );

  const onMapUnmount = useCallback(() => {
    markersRef.current.forEach(m => (m.map = null));
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;
    mapRef.current = null;
    markersRef.current = [];
  }, []);

  useEffect(() => {
    if (selectedHouse && mapRef.current) {
      const lat = Number(selectedHouse.location.latitude),
        lng = Number(selectedHouse.location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.panTo({ lat, lng });
      }
    }
  }, [selectedHouse]);

  const onIdle = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const zoom = mapRef.current.getZoom();
    if (center && typeof zoom === 'number') {
      setViewState({
        latitude: center.lat(),
        longitude: center.lng(),
        zoom,
      });
    }
  }, [setViewState]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={{ lat: viewState.latitude, lng: viewState.longitude }}
        zoom={viewState.zoom}
        options={{
          mapTypeId: 'hybrid',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          mapId: 'DEMO_MAP_ID',
         // maximum zoom level to prevent over-zooming
         maxZoom: 16,
        }}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onIdle={onIdle}
      >
        {selectedHouse &&
          !isNaN(Number(selectedHouse.location.latitude)) &&
          !isNaN(Number(selectedHouse.location.longitude)) && (
            <InfoWindow
              position={{
                lat: Number(selectedHouse.location.latitude),
                lng: Number(selectedHouse.location.longitude),
              }}
              onCloseClick={() => setSelectedHouse(null)}
              options={{
                      pixelOffset: new window.google.maps.Size(0, -30),
                      }}
                
            >
              <HousePopupCard house={selectedHouse} />
            </InfoWindow>
          )}
      </GoogleMap>

      {/* GLOBAL CSS OVERRIDES TO REMOVE DEFAULT WHITE INFOWINDOW */}
      <style jsx global>{`
  /* 1) Collapse the middle slice wrapper so it doesn't generate a box */
  .gm-style .gm-style-iw-d {
    display: contents !important;
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* 2) Hide all of the other 9-slice pieces (left/right/bottom and arrow bits) */
  .gm-style .gm-style-iw-l,
  .gm-style .gm-style-iw-r,
  .gm-style .gm-style-iw-b,
  .gm-style .gm-style-iw-t::before,
  .gm-style .gm-style-iw-t::after {
    display: none !important;
  }

  /* 3) Remove any default bg/shadow/padding on the outer container */
  .gm-style .gm-style-iw,
  .gm-style .gm-style-iw-c {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* 4) Force your React card (the first child inside the InfoWindow) to fill 100% */
  .gm-style .gm-style-iw-c > * {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
      /* Move the default close button into the top-right of the card */
  .gm-style .gm-ui-hover-effect {
    /* Make sure it’s visible and on top */
    opacity: 1 !important;
    z-index: 10 !important;

    /* Position inside the popup container */
    position: absolute !important;
    top: 8px !important;
    right: 8px !important;

`}</style>

    </div>
  );
}
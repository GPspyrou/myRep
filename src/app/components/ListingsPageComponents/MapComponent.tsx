'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useLoadScript, GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { House } from '@/app/types/house';
import HousePopupCard from '@/app/components/ListingsPageComponents/HousePopupCard';

export type ViewState = {
  latitude: number;
  longitude: number;
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
const libraries: ('places' | 'marker')[] = ['places', 'marker'];

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

      // Clear existing markers
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
      clustererRef.current?.clearMarkers();

      // Create and cluster markers
      const markers = houses
        .map((house) => {
          const lat = Number(house.location.latitude);
          const lng = Number(house.location.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          const label =
            house.bedrooms != null && house.bathrooms != null
              ? `${house.bedrooms}BD | ${house.bathrooms}BA | ${house.size} M²`
              : house.size != null
              ? `${house.size} M²`
              : 'No data';

          const div = document.createElement('div');
          Object.assign(div.style, {
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
          div.textContent = label;

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content: div,
            gmpClickable: true,
            title: house.title || '',
          });
          marker.addListener('gmp-click', () => setSelectedHouse(house));
          return marker;
        })
        .filter(
          (m): m is google.maps.marker.AdvancedMarkerElement => m !== null
        );

      markersRef.current = markers;

      clustererRef.current = new MarkerClusterer({
        map,
        markers,
        renderer: {
          render({ count, position }) {
            const e = document.createElement('div');
            Object.assign(e.style, {
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
            e.textContent = String(count);
            return new google.maps.marker.AdvancedMarkerElement({ position, content: e });
          },
        },
      });
    },
    [houses, setSelectedHouse]
  );

  const onMapUnmount = useCallback(() => {
    markersRef.current.forEach((m) => (m.map = null));
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;
    mapRef.current = null;
    markersRef.current = [];
  }, []);

  useEffect(() => {
    if (selectedHouse && mapRef.current) {
      const lat = Number(selectedHouse.location.latitude);
      const lng = Number(selectedHouse.location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.panTo({ lat, lng });
      }
    }
  }, [selectedHouse]);

  const onIdle = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const z = mapRef.current.getZoom();
    if (center && typeof z === 'number') {
      setViewState?.({ latitude: center.lat(), longitude: center.lng(), zoom: z });
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
          maxZoom: 16,
        }}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onIdle={onIdle}
      >
        {selectedHouse && (
          <InfoWindow
            key={selectedHouse.id}
            position={{
              lat: Number(selectedHouse.location.latitude),
              lng: Number(selectedHouse.location.longitude),
            }}
            onCloseClick={() => setSelectedHouse(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
          >
            <HousePopupCard house={selectedHouse} />
          </InfoWindow>
        )}
      </GoogleMap>
      <style jsx global>{`
        .gm-style .gm-style-iw-d {
          display: contents !important;
        }
        .gm-style .gm-style-iw-l,
        .gm-style .gm-style-iw-r,
        .gm-style .gm-style-iw-b,
        .gm-style .gm-style-iw-t::before,
        .gm-style .gm-style-iw-t::after {
          display: none !important;
        }
        .gm-style .gm-style-iw,
        .gm-style .gm-style-iw-c {
          background: transparent !important;
          box-shadow: none !important;
        }
        .gm-style .gm-style-iw-c > * {
          width: 100% !important;
          height: 100% !important;
        }
        .gm-style .gm-ui-hover-effect {
          opacity: 1 !important;
          z-index: 10 !important;
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
        }
      `}</style>
    </div>
  );
}

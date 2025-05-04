'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useLoadScript, GoogleMap, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { House } from '@/app/types/house';

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
const libraries = ['places'] as const;

export default function MapComponent({
  houses,
  viewState,
  selectedHouse,
  setViewState = () => {},
  setSelectedHouse = () => {},
}: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: [...libraries],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // clean up any old markers/clusters
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    clustererRef.current?.clearMarkers();

    // build individual markers
    const markers = houses
      .map(house => {
        const lat = Number(house.location.latitude),
          lng = Number(house.location.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          icon: {
            url: '/marker.svg',
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          },
        });

        marker.addListener('click', () => setSelectedHouse(house));
        return marker;
      })
      .filter((m): m is google.maps.Marker => m !== null);

    markersRef.current = markers;

    // custom renderer: circle + count label
    const renderer = {
      render({ count, position }: { count: number; position: google.maps.LatLng }) {
        return new google.maps.Marker({
          position,
          label: {
            text: String(count),
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#333',
            fillOpacity: 0.75,
            strokeColor: '#fff',
            strokeWeight: 2,
            scale: 20 + (count.toString().length - 1) * 8, // size up for >9
          },
        });
      },
    };

    // create the clusterer
    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      renderer,
      // optional: gridSize, minimumClusterSize, etc.
    });
  }, [houses, setSelectedHouse]);

  const onMapUnmount = useCallback(() => {
    markersRef.current.forEach(m => m.setMap(null));
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;
    mapRef.current = null;
    markersRef.current = [];
  }, []);

  // pan to selected house
  useEffect(() => {
    if (selectedHouse && mapRef.current) {
      const lat = Number(selectedHouse.location.latitude),
            lng = Number(selectedHouse.location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.panTo({ lat, lng });
      }
    }
  }, [selectedHouse]);

  // sync view state
  const onIdle = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter(),
          zoom = mapRef.current.getZoom();
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
        }}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onIdle={onIdle}
      />

      {selectedHouse && (() => {
        const lat = Number(selectedHouse.location.latitude),
              lng = Number(selectedHouse.location.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <InfoWindow position={{ lat, lng }} onCloseClick={() => setSelectedHouse(null)}>
            <div className="w-64 fade-in-popup">
              <div className="relative w-full h-40">
                <Image
                  src={selectedHouse.images[0]?.src || '/placeholder.jpg'}
                  alt={selectedHouse.title}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>
              <div className="p-4 bg-white rounded-b-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 truncate">
                  {selectedHouse.title}
                </h3>
                <p className="mt-1 text-lg font-bold text-green-600">
                  {selectedHouse.price}
                </p>
                {selectedHouse.bedrooms != null &&
                  selectedHouse.bathrooms != null && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedHouse.bedrooms} bd • {selectedHouse.bathrooms} ba •{' '}
                      {selectedHouse.size} sqft
                    </p>
                  )}
                <button
                  onClick={() => window.open(`/houses/${selectedHouse.id}`, '_blank')}
                  className="mt-4 w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
              <style jsx>{`
                .fade-in-popup {
                  animation: fadeIn 1s ease-out;
                }
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}</style>
            </div>
          </InfoWindow>
        );
      })()}
    </div>
  );
}

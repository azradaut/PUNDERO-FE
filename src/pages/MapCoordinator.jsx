// MapCoordinator.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { createRoot } from "react-dom/client";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    useMap
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const PoiMarkers = ({ pois }) => {
    const map = useMap();
    const [markers, setMarkers] = useState({});
    const clusterer = useRef(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    useEffect(() => {
        if (clusterer.current) {
            clusterer.current.clearMarkers();
            clusterer.current.addMarkers(Object.values(markers));
        }
    }, [markers]);

    const setMarkerRef = (marker, key) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    return (
        <>
            {pois.map(poi => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={() => console.log(`${poi.key} clicked`)}
                >
                    <Pin
                        background={poi.type === 'warehouse' ? '#FF0000' : '#0000FF'}
                        glyphColor={'#FFFFFF'}
                        borderColor={'#000000'}
                    />
                </AdvancedMarker>
            ))}
        </>
    );
};

const MapCoordinator = () => {
    const apiKey = 'AIzaSyBImLKFT3gd7ZSdjJnnlrp5MFjed6rZcbA';
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchStoresAndWarehouses = async () => {
            try {
                const [storesResponse, warehousesResponse] = await Promise.all([
                    axios.get('http://localhost:8515/api/Stores/GetStores'),
                    axios.get('http://localhost:8515/api/Warehouses/GetWarehouses')
                ]);

                const stores = storesResponse.data.map(store => ({
                    key: `store-${store.id}`,
                    location: { lat: store.latitude, lng: store.longitude },
                    type: 'store'
                }));

                const warehouses = warehousesResponse.data.map(warehouse => ({
                    key: `warehouse-${warehouse.id}`,
                    location: { lat: warehouse.latitude, lng: warehouse.longitude },
                    type: 'warehouse'
                }));

                setLocations([...stores, ...warehouses]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchStoresAndWarehouses();
    }, []);

    return (
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={14}
                defaultCenter={{ lat: 43.856430, lng: 18.413029 }}
                mapId='YOUR_MAP_ID' // Optional, use if you have map styling
                onCameraChanged={(ev) => console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)}
                style={{ width: '100%', height: '100vh' }}
            >
                <PoiMarkers pois={locations} />
            </Map>
        </APIProvider>
    );
};

export default MapCoordinator;

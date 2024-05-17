import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
    useMap
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const PoiMarkers = ({ pois, map }) => {
    const [markers, setMarkers] = useState({});
    const [selectedPoi, setSelectedPoi] = useState(null);
    const infoWindowRef = useRef(null);

    useEffect(() => {
        if (map && !infoWindowRef.current) {
            console.log('Initializing InfoWindow...');
            infoWindowRef.current = new window.google.maps.InfoWindow();
        }
    }, [map]);

    useEffect(() => {
        if (map && markers) {
            const clusterer = new MarkerClusterer({ map });
            clusterer.clearMarkers();
            clusterer.addMarkers(Object.values(markers));
        }
    }, [markers, map]);

    const setMarkerRef = (marker, poi) => {
        if (marker && markers[poi.key]) return;
        if (!marker && !markers[poi.key]) return;

        setMarkers(prev => {
            if (marker) {
                console.log(`Adding click listener for marker: ${poi.name}`);
                marker.addListener('click', () => {
                    setSelectedPoi(poi);
                    if (infoWindowRef.current) {
                        const content = `
                            <div>
                                <h3>${poi.type === 'warehouse' ? 'Warehouse' : 'Store'}: ${poi.name || 'Unnamed'}</h3>
                                <p>Address: ${poi.address}</p>
                            </div>
                        `;
                        console.log(`Setting InfoWindow content for: ${poi.name}`);
                        infoWindowRef.current.setContent(content);
                        console.log(`Opening InfoWindow for: ${poi.name}`);
                        infoWindowRef.current.open(map, marker);
                    } else {
                        console.log('InfoWindow is not initialized');
                    }
                });
                return { ...prev, [poi.key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[poi.key];
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
                    ref={marker => setMarkerRef(marker, poi)}
                    clickable={true}
                >
                    <Pin
                        background={poi.type === 'warehouse' ? '#FF0000' : '#0000FF'}
                        glyphColor={'#FFFFFF'}
                        borderColor={'#000000'}
                    />
                </AdvancedMarker>
            ))}
            {selectedPoi && (
                <InfoWindow
                    position={selectedPoi.location}
                    onCloseClick={() => setSelectedPoi(null)}
                >
                    <div>
                        <h3>{selectedPoi.type === 'warehouse' ? 'Warehouse' : 'Store'}: {selectedPoi.name || 'Unnamed'}</h3>
                        <p>Address: {selectedPoi.address}</p>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

const MapCoordinator = () => {
    const apiKey = 'AIzaSyBImLKFT3gd7ZSdjJnnlrp5MFjed6rZcbA';
    const [locations, setLocations] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchStoresAndWarehouses = async () => {
            try {
                const [storesResponse, warehousesResponse] = await Promise.all([
                    axios.get('http://localhost:8515/api/Stores/GetStores'),
                    axios.get('http://localhost:8515/api/Warehouses/GetWarehouses')
                ]);

                const stores = storesResponse.data.map(store => ({
                    key: `store-${store.id || Math.random().toString(36).substr(2, 9)}`,
                    location: { lat: store.latitude, lng: store.longitude },
                    name: store.name,
                    address: store.address,
                    type: 'store'
                }));

                const warehouses = warehousesResponse.data.map(warehouse => ({
                    key: `warehouse-${warehouse.id || Math.random().toString(36).substr(2, 9)}`,
                    location: { lat: warehouse.latitude, lng: warehouse.longitude },
                    name: warehouse.name || 'Unnamed Warehouse', // Handle undefined name
                    address: warehouse.address,
                    type: 'warehouse'
                }));

                console.log('Fetched stores:', stores);
                console.log('Fetched warehouses:', warehouses);
                setLocations([...stores, ...warehouses]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchStoresAndWarehouses();
    }, []);

    const handleLoad = (map) => {
        mapRef.current = map;
        console.log('Maps API has loaded.');
    };

    return (
        <APIProvider apiKey={apiKey} onLoad={() => handleLoad(mapRef.current)}>
            <Map
                defaultZoom={14}
                defaultCenter={{ lat: 43.856430, lng: 18.413029 }}
                mapId='YOUR_MAP_ID' // Optional, use if you have map styling
                onLoad={handleLoad}
                style={{ width: '100%', height: '100vh' }}
            >
                <PoiMarkers pois={locations} map={mapRef.current} />
            </Map>
        </APIProvider>
    );
};

export default MapCoordinator;
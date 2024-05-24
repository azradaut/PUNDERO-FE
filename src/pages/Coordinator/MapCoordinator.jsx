import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const PoiMarkers = ({ pois, map }) => {
    const [markers, setMarkers] = useState({});
    const [selectedPoi, setSelectedPoi] = useState(null);
    const infoWindowRef = useRef(null);
    const markersRef = useRef({}); // Ref to track markers

    useEffect(() => {
        if (map && !infoWindowRef.current) {
            console.log('Initializing InfoWindow...');
            infoWindowRef.current = new window.google.maps.InfoWindow();
        }
    }, [map]);

    useEffect(() => {
        if (map) {
            const clusterer = new MarkerClusterer({ map });
            clusterer.clearMarkers();
            clusterer.addMarkers(Object.values(markers));
        }
    }, [markers, map]);

    const setMarkerRef = (marker, poi) => {
        if (!marker || markersRef.current[poi.key]) return;

        markersRef.current[poi.key] = marker;
        setMarkers(prev => ({
            ...prev,
            [poi.key]: marker
        }));

        console.log(`Adding click listener for marker: ${poi.name}`);
        marker.addListener('click', () => {
            setSelectedPoi(poi);
            if (infoWindowRef.current) {
                const content = `
                    <div>
                        <h3>${poi.type === 'warehouse' ? 'Warehouse' : poi.type === 'store' ? 'Store' : 'Driver'}: ${poi.name || 'Unnamed'}</h3>
                        <p>Address: ${poi.address || ''}</p>
                        ${poi.type === 'driver' ? `<p>Phone: ${poi.phone}</p>` : ''}
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
                        background={poi.type === 'warehouse' ? '#FF0000' : poi.type === 'store' ? '#0000FF' : '#00FF00'}
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
                        <h3>{selectedPoi.type === 'warehouse' ? 'Warehouse' : selectedPoi.type === 'store' ? 'Store' : 'Driver'}: {selectedPoi.name || 'Unnamed'}</h3>
                        <p>Address: {selectedPoi.address || ''}</p>
                        {selectedPoi.type === 'driver' && <p>Phone: {selectedPoi.phone}</p>}
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

    const fetchData = async () => {
        try {
            const [storesResponse, warehousesResponse, driversResponse] = await Promise.all([
                axios.get('http://localhost:8515/api/Stores/GetStores'),
                axios.get('http://localhost:8515/api/Warehouses/GetWarehouses'),
                axios.get('http://localhost:8515/api/Location/getall')
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
                name: warehouse.name || 'Unnamed Warehouse', //Jer imamo skladišta bez imena
                address: warehouse.address,
                type: 'warehouse'
            }));

            const drivers = driversResponse.data.map(driver => ({
                key: `driver-${driver.driverId}`,
                location: { lat: driver.lkLatitude, lng: driver.lkLongitude },
                name: `${driver.firstName} ${driver.lastName}`,
                phone: driver.mobilePhoneNumber,
                type: 'driver'
            }));

            console.log('Fetched stores:', stores);
            console.log('Fetched warehouses:', warehouses);
            console.log('Fetched drivers:', drivers);
            setLocations([...stores, ...warehouses, ...drivers]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000); // Fetch data every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
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

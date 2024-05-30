// src/pages/Client/ClientMap.jsx
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
    const markersRef = useRef({});

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

        marker.addListener('click', () => {
            setSelectedPoi(poi);
            if (infoWindowRef.current) {
                const content = `
                    <div>
                        <h3>${poi.type === 'store' ? 'Store' : 'Driver'}: ${poi.name || 'Unnamed'}</h3>
                        <p>Address: ${poi.address || ''}</p>
                        ${poi.type === 'driver' ? `<p>Phone: ${poi.phone}</p>` : ''}
                    </div>
                `;
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
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
                        background={poi.type === 'store' ? '#0000FF' : '#00FF00'}
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
                        <h3>{selectedPoi.type === 'store' ? 'Store' : 'Driver'}: {selectedPoi.name || 'Unnamed'}</h3>
                        <p>Address: {selectedPoi.address || ''}</p>
                        {selectedPoi.type === 'driver' && <p>Phone: {selectedPoi.phone}</p>}
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

const ClientMap = () => {
    const apiKey = 'AIzaSyBImLKFT3gd7ZSdjJnnlrp5MFjed6rZcbA';
    const [locations, setLocations] = useState([]);
    const mapRef = useRef(null);
    const storeName = localStorage.getItem('storeName');

    const fetchData = async () => {
        try {
            const [storeResponse, driversResponse] = await Promise.all([
                axios.get(`http://localhost:8515/api/ClientMap/store/${storeName}`),
                axios.get(`http://localhost:8515/api/ClientMap/drivers/${storeName}`)
            ]);

            const store = storeResponse.data && {
                key: `store-${storeResponse.data.idStore}`,
                location: { lat: storeResponse.data.latitude, lng: storeResponse.data.longitude },
                name: storeResponse.data.name,
                address: storeResponse.data.address,
                type: 'store'
            };

            const drivers = driversResponse.data.map(driver => ({
                key: `driver-${driver.driverId}`,
                location: { lat: driver.lkLatitude, lng: driver.lkLongitude },
                name: `${driver.firstName} ${driver.lastName}`,
                phone: driver.mobilePhoneNumber,
                type: 'driver'
            }));

            setLocations([store, ...drivers]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
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
                mapId='YOUR_MAP_ID'
                onLoad={handleLoad}
                style={{ width: '100%', height: '100vh' }}
            >
                <PoiMarkers pois={locations} map={mapRef.current} />
            </Map>
        </APIProvider>
    );
};

export default ClientMap;

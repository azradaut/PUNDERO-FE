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

const ClientMarkers = ({ drivers, store, map }) => {
    const [markers, setMarkers] = useState({});
    const [selectedDriver, setSelectedDriver] = useState(null);
    const infoWindowRef = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (map && !infoWindowRef.current) {
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

    const setMarkerRef = (marker, driver) => {
        if (!marker || markersRef.current[driver.key]) return;

        markersRef.current[driver.key] = marker;
        setMarkers(prev => ({
            ...prev,
            [driver.key]: marker
        }));

        marker.addListener('click', () => {
            setSelectedDriver(driver);
            if (infoWindowRef.current) {
                const content = `
                    <div>
                        <img src="http://localhost:8515/images/profile_images/${driver.image}" alt="Profile Image" style="width: 100px; height: 100px; object-fit: cover;"/>
                        <h3>Driver: ${driver.name}</h3>
                        <p>Invoices: ${driver.invoices.join(', ')}</p>
                    </div>
                `;
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
            }
        });
    };

    return (
        <>
            {store && (
                <AdvancedMarker
                    key={store.idStore}
                    position={{ lat: store.location.latitude, lng: store.location.longitude }}
                    clickable={true}
                >
                    <Pin
                        background='#0000FF'
                        glyphColor='#FFFFFF'
                        borderColor='#000000'
                    />
                </AdvancedMarker>
            )}
            {drivers.map(driver => (
                <AdvancedMarker
                    key={driver.key}
                    position={driver.location}
                    ref={marker => setMarkerRef(marker, driver)}
                    clickable={true}
                >
                    <Pin
                        background='#00FF00'
                        glyphColor='#FFFFFF'
                        borderColor='#000000'
                    />
                </AdvancedMarker>
            ))}
            {selectedDriver && (
                <InfoWindow
                    position={selectedDriver.location}
                    onCloseClick={() => setSelectedDriver(null)}
                >
                    <div>
                        <img src={`http://localhost:8515/images/profile_images/Driver${selectedDriver.image}`} alt="Profile Image" style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
                        <h3>Driver: {selectedDriver.name}</h3>
                        <p>Invoices: {selectedDriver.invoices.join(', ')}</p>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

const ClientMap = () => {
    const apiKey = 'AIzaSyBImLKFT3gd7ZSdjJnnlrp5MFjed6rZcbA';
    const [drivers, setDrivers] = useState([]);
    const [store, setStore] = useState(null);
    const mapRef = useRef(null);

    const fetchData = async () => {
        try {
            const storedClientInfo = {
                storeName: localStorage.getItem('storeName'),
                token: localStorage.getItem('token'),
                clientId: localStorage.getItem('clientId'),
                role: localStorage.getItem('role'),
                lastName: localStorage.getItem('lastName'),
                firstName: localStorage.getItem('firstName')
            };

            const [driversResponse, storeResponse] = await Promise.all([
                axios.get(`http://localhost:8515/api/Inv/intransitToClient/${storedClientInfo.storeName}`, {
                    headers: {
                        Authorization: `Bearer ${storedClientInfo.token}`
                    }
                }),
                axios.get(`http://localhost:8515/api/Stores/GetStoreByName/getStoreByName/${storedClientInfo.storeName}`, {
                    headers: {
                        Authorization: `Bearer ${storedClientInfo.token}`
                    }
                })
            ]);

            const driverData = driversResponse.data.map(driver => ({
                key: `driver-${driver.driverId}`,
                location: { lat: driver.lkLatitude, lng: driver.lkLongitude },
                name: `${driver.firstName} ${driver.lastName}`,
                invoices: driver.invoices,
                image: `${driver.firstName}${driver.lastName}.jpeg` 
            }));

            const storeData = {
                idStore: storeResponse.data.idStore,
                name: storeResponse.data.name,
                address: storeResponse.data.address,
                location: {
                    latitude: storeResponse.data.location.latitude,
                    longitude: storeResponse.data.location.longitude
                }
            };

            setDrivers(driverData);
            setStore(storeData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleLoad = (map) => {
        mapRef.current = map;
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
                <ClientMarkers drivers={drivers} store={store} map={mapRef.current} />
            </Map>
        </APIProvider>
    );
};

export default ClientMap;

import React, { useState, useEffect } from 'react';
import ItemTable from '../components/ItemTable';
import FilterBar from '../components/FilterBar';
import AddItem from '../components/AddItem';
import EditItem from '../components/EditItem';
import { Button } from '@mui/material';

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        fetchData(); 
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8515/api/Vehicle');
            const data = await response.json();
            setVehicles(data);
            setFilteredVehicles(data); 
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            // Dodaj
        }
    };

    const handleSearchChange = (newSearchText) => {
        setSearchText(newSearchText);
        
        const filteredResult = vehicles.filter((vehicle) => {
            return Object.values(vehicle).some((value) =>
                typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
            );
        });
        setFilteredVehicles(filteredResult); 
    };

    const handleAddItem = async (formData) => {
        try {
          const response = await fetch('http://localhost:8515/api/Vehicle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (!response.ok) {
            throw new Error('Failed to add vehicle');
          }
          // Refetch data to update the table
          fetchData();
        } catch (error) {
          console.error('Error adding vehicle:', error);
          // Handle errors gracefully, e.g., display an error message to the user
        }
      };

    const handleDeleteItemClick = async (item) => {
        console.log("Deleting item with ID Vehicle:", item.idVehicle); // Corrected log statement
        try {
            const response = await fetch(`http://localhost:8515/api/Vehicle/DeleteVehicle/${item.idVehicle}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete vehicle');
            }
    
            // Refetch data to update the table
            fetchData();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };
    
    

    const handleEditItem = (item) => {
        setEditItem(item); 
    };

    const handleSaveEdit = async (formData) => {
        try {
          const response = await fetch(`http://localhost:8515/api/Vehicle/${formData.idVehicle}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          if (!response.ok) {
            throw new Error('Failed to save changes');
          }
      
          fetchData(); // Refetch data to update the table
          setEditItem(null); // Close the edit popup
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      };
      

    const categoryAttributes = vehicles.length > 0 ? Object.keys(vehicles[0]).filter(attr => attr !== 'id') : [];

    return (
        <div>
      <h2>Vehicles</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem onAdd={handleAddItem} onClose={() => setShowAddDialog(false)} categoryAttributes={Object.keys(vehicles[0] || {})} />
      )}
            {editItem && (
                <EditItem
                    item={editItem}
                    fields={categoryAttributes}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditItem(null)}
                />
            )}
            {filteredVehicles.length > 0 ? (
               <ItemTable
               items={filteredVehicles}
               headers={Object.keys(vehicles[0] || {})}
               onEdit={handleEditItem}
               onDelete={handleDeleteItemClick} 
               fields={categoryAttributes} 
             />
            ) : (
                <p>No vehicles match the current filters.</p>
            )}
        </div>
    );
}

export default Vehicles;
// src/pages/Coordinator/Invoices.jsx
import React, { useState, useEffect } from 'react';
import FilterBar from '../../components/FilterBar';
import ItemTable from '../../components/ItemTable';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Inv');
      const data = await response.json();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    const filtered = invoices.filter((invoice) =>
      invoice.store.name.toLowerCase().includes(newSearchText.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    const filtered = invoices.filter((invoice) => invoice.idStatus === parseInt(status));
    setFilteredInvoices(filtered);
  };

  return (
    <div>
      <h2>Invoices</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <select value={statusFilter} onChange={handleStatusChange}>
        <option value="">All</option>
        <option value="1">Pending</option>
        <option value="2">Approved</option>
        <option value="3">Denied</option>
      </select>
      <ItemTable
        items={filteredInvoices}
        headers={['store.name', 'issueDate', 'status.name']}
        onDelete={() => {}}
        onSave={() => {}}
        fields={['store.name', 'issueDate', 'status.name']}
      />
    </div>
  );
}

export default Invoices;

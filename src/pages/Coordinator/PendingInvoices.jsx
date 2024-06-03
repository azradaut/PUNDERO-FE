import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TablePagination,
} from "@mui/material";
import { useNotification } from "../../contexts/NotificationContext";
import axios from "axios";

const PendingInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stores, setStores] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [availabilityDetails, setAvailabilityDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNotifications } = useNotification();

  useEffect(() => {
    fetchInvoices();
    fetchStores();
    fetchWarehouses();
    fetchDrivers();
  }, []);

  const fetchInvoices = async () => {
    const response = await axios.get("http://localhost:8515/api/Inv/pending");
    const invoices = response.data;

    for (let invoice of invoices) {
      const availabilityResponse = await axios.post(
        "http://localhost:8515/api/Product/CheckAvailability",
        invoice.invoiceProducts.map((product) => ({
          productId: product.idProduct,
          quantity: product.orderQuantity,
        }))
      );
      invoice.allAvailable = availabilityResponse.data.allAvailable;
    }

    setInvoices(invoices);
  };

  const fetchStores = async () => {
    const response = await axios.get(
      "http://localhost:8515/api/Stores/GetStores"
    );
    setStores(response.data);
  };

  const fetchWarehouses = async () => {
    const response = await axios.get(
      "http://localhost:8515/api/Warehouses/GetWarehouses"
    );
    setWarehouses(response.data);
  };

  const fetchDrivers = async () => {
    const response = await axios.get(
      "http://localhost:8515/api/Driver/GetDriversWithName"
    );
    setDrivers(response.data);
  };

  const handleApprove = async (invoice) => {
    if (!invoice.selectedDriver || !invoice.selectedWarehouse) {
      alert("Please select both driver and warehouse.");
      return;
    }

    try {
      window.location.reload();
      await axios.put(
        `http://localhost:8515/api/Inv/${invoice.idInvoice}/assign`,
        {
          warehouseId: invoice.selectedWarehouse,
          driverId: invoice.selectedDriver,
        }
      );

      await axios.put(
        `http://localhost:8515/api/Inv/${invoice.idInvoice}/approve`
      );

      setInvoices((prevInvoices) =>
        prevInvoices.filter((inv) => inv.idInvoice !== invoice.idInvoice)
      );
      setNotifications((prev) => [
        ...prev,
        { message: "Invoice approved", seen: false },
      ]);
    } catch (error) {
      console.error("Error approving invoice:", error);
    }
  };

  const handleReject = async (invoice) => {
    try {
      window.location.reload();
      await axios.put(
        `http://localhost:8515/api/Inv/${invoice.idInvoice}/reject`
      );
      setInvoices((prev) =>
        prev.filter((inv) => inv.idInvoice !== invoice.idInvoice)
      );
      setNotifications((prev) => [
        ...prev,
        { message: "Invoice rejected", seen: false },
      ]);
    } catch (error) {
      console.error("Error rejecting invoice:", error);
    }
  };

  const checkAvailability = async (invoice) => {
    const response = await axios.post(
      "http://localhost:8515/api/Product/CheckAvailability",
      invoice.invoiceProducts.map((product) => ({
        productId: product.idProduct,
        quantity: product.orderQuantity,
      }))
    );

    setAvailabilityDetails(response.data.products);
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Id Invoice</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Store Name</TableCell>
              <TableCell>Warehouse Name</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Product Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.idInvoice}>
                <TableCell>{invoice.idInvoice}</TableCell>
                <TableCell>
                  {new Date(invoice.issueDate).toLocaleString()}
                </TableCell>
                <TableCell>
                  {stores.find((s) => s.idStore === invoice.idStore)?.name ||
                    "N/A"}
                </TableCell>
                <TableCell>
                  <Select
                    value={invoice.selectedWarehouse || ""}
                    onChange={(e) => {
                      const selectedWarehouse = e.target.value;
                      setInvoices((prev) =>
                        prev.map((inv) =>
                          inv.idInvoice === invoice.idInvoice
                            ? { ...inv, selectedWarehouse }
                            : inv
                        )
                      );
                    }}
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem
                        key={warehouse.idWarehouse}
                        value={warehouse.idWarehouse}
                      >
                        {warehouse.nameWarehouse}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={invoice.selectedDriver || ""}
                    onChange={(e) => {
                      const selectedDriver = e.target.value;
                      setInvoices((prev) =>
                        prev.map((inv) =>
                          inv.idInvoice === invoice.idInvoice
                            ? { ...inv, selectedDriver }
                            : inv
                        )
                      );
                    }}
                  >
                    {drivers.map((driver) => (
                      <MenuItem
                        key={driver.idDriver}
                        value={driver.idDriver}
                      >{`${driver.firstName} ${driver.lastName}`}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: invoice.allAvailable
                      ? "lightgreen"
                      : "lightcoral",
                  }}
                >
                  {invoice.allAvailable ? "Available" : "Not Available"}
                  <Button onClick={() => checkAvailability(invoice)}>
                    More
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleApprove(invoice)}>
                    Approve
                  </Button>
                  <Button onClick={() => handleReject(invoice)}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Product Availability</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Order Quantity</TableCell>
                  <TableCell>Available Quantity</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Available</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availabilityDetails.map((product) => (
                  <TableRow
                    key={product.idProduct}
                    style={{
                      backgroundColor:
                        product.availableQuantity >= product.orderQuantity
                          ? "white"
                          : "lightcoral",
                    }}
                  >
                    <TableCell>{product.nameProduct}</TableCell>
                    <TableCell>{product.orderQuantity}</TableCell>
                    <TableCell>{product.availableQuantity}</TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>
                      {product.availableQuantity >= product.orderQuantity
                        ? "Yes"
                        : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Button onClick={handleDialogClose}>Close</Button>
      </Dialog>
    </div>
  );
};

export default PendingInvoices;

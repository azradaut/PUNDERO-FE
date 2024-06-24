import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PunderoLogoBlue from '../images/logo/PunderoLogoBlue.png';

const ExportInvoice = ({ id }) => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      console.log('Fetching invoice data for id:', id);
      try {
        const response = await axios.get(`http://localhost:8515/api/ExportInvoice/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      }
    };

    fetchInvoice();
  }, [id]);

  const exportPdf = () => {
    const input = document.getElementById('invoice');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice.idInvoice}.pdf`);
    });
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', fontFamily: 'Arial, sans-serif' }}>
      <Button variant="contained" color="primary" onClick={exportPdf} style={{ marginBottom: '20px' }}>
        Export as PDF
      </Button>
      <div id="invoice" style={{ padding: '40px', margin: '0 auto', maxWidth: '800px', border: '1px solid #ddd', position: 'relative' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <img src={PunderoLogoBlue} alt="Pundero Logo" style={{ width: '150px' }} />
          <h2 style={{ margin: 0 }}>INVOICE</h2>
        </header>
        <section style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>BILLED TO:</strong>
            <p>{invoice.storeName}<br />{invoice.storePhone}<br />{invoice.storeAddress}</p>
          </div>
          <div>
            <strong>PUNDERO</strong><br />
            Zmaja od Bosne 8, Sarajevo 71000<br />
            033 565-200<br />
            info@pundero.ba
          </div>
        </section>
        <section style={{ marginBottom: '40px' }}>
          <div>
            <strong>Invoice No:</strong> {invoice.idInvoice}<br />
            <strong>Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}
          </div>
        </section>
        <table style={{ width: '100%', marginBottom: '40px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', paddingBottom: '8px' }}>Item</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', paddingBottom: '8px' }}>Quantity</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', paddingBottom: '8px' }}>Unit Price</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', paddingBottom: '8px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product, index) => (
              <tr key={index}>
                <td style={{ paddingTop: '8px' }}>{product.nameProduct}</td>
                <td style={{ paddingTop: '8px' }}>{product.orderQuantity}</td>
                <td style={{ paddingTop: '8px' }}>{product.unitPrice.toFixed(2)}</td>
                <td style={{ paddingTop: '8px' }}>{product.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <section style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <strong>Subtotal:</strong> {invoice.subtotal.toFixed(2)}<br />
            <strong>Tax:</strong> {invoice.tax.toFixed(2)}<br />
            <strong>Total:</strong> {invoice.totalAmount.toFixed(2)}
          </div>
        </section>
        <section style={{ marginBottom: '40px' }}>
          <strong>Assigned Driver:</strong> {invoice.driverName}<br />
          <strong>Email:</strong> {invoice.driverEmail}<br />
          <strong>Phone:</strong> {invoice.driverPhone}
        </section>
        <section>
          <p>Thank you!</p>
        </section>
      </div>
    </div>
  );
};

export default ExportInvoice;

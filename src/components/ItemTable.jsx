import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';

function ItemTable({ items, headers, onRowClick }) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`${item.id}-${index}`} hover onClick={() => onRowClick(item.id)}>
              {headers.map((header) => (
                <TableCell key={`${item.id}-${header}`}>{item[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ItemTable;

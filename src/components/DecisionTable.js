import React, { useState, useEffect } from 'react';
// Javascript sdk
import { createInstance } from '@optimizely/optimizely-sdk';
// React sdk
import {
  //createInstance,
  OptimizelyProvider,
  useDecision,
} from '@optimizely/react-sdk';
// mui
import { Typography, Box } from '@mui/material';
// charts
import { PieChart } from 'recharts';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const DecisionTable = ({ decisionResults }) => {
  // Get object property names for columns
  const columnFields = Object.getOwnPropertyNames(decisionResults[0]);
  let columns = [];

  columnFields.map((field) => {
    columns.push({
      field: field,
      headerName: field,
      width: 200,
      editable: false,
    });
  });

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        getRowId={(row) => row.userId}
        rows={decisionResults}
        columns={columns}
        rowsPerPageOptions={[100]}
        disableSelectionOnClick
        //experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default DecisionTable;

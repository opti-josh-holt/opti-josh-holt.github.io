import React from 'react';

// components
import ProjectSettings from './ProjectSettings';

// mui
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AppLayout = (props) => {
  return (
    <React.Fragment>
      <CssBaseline />

      <Box sx={{ flexGrow: 1, height: '100vh' }}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              Flags Helper
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid container spacing={0}>
          <Grid item xs={2}>
            <Item>xs=2</Item>
          </Grid>
          <Grid item xs={10}>
            <Item>
              <ProjectSettings />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default AppLayout;

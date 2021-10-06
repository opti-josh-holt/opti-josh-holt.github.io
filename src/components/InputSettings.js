import React, { useState } from 'react';

import {
  TextField,
  Box,
  Slider,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
/*
 TO DOs
- Update Flag key be a dropdown (Select in mui) that pulls once SDK key is entered
*/

const Input = styled(MuiInput)`
  width: 42px;
`;

const InputSettings = ({ setInputSettings }) => {
  // Handle form values
  const [sdkKey, setSdkKey] = useState('');
  const [flagKey, setFlagKey] = useState('');
  const [numUsers, setNumUsers] = useState('');

  const [value, setValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const handleSubmit = () => {
    const formValues = {
      sdkKey: sdkKey === '' ? null : sdkKey,
      flagKey: flagKey === '' ? null : flagKey,
      numUsers: numUsers === '' ? null : numUsers,
    };
    setInputSettings(formValues);
  };

  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete='off'
    >
      <TextField
        id='sdk-key-input'
        label='SDK key'
        required
        value={sdkKey}
        onInput={(e) => setSdkKey(e.target.value)}
      />
      <TextField
        id='flag-key-input'
        label='Flag key'
        required
        value={flagKey}
        onInput={(e) => setFlagKey(e.target.value)}
      />
      <TextField
        id='flag-key-input'
        label='Users to fake (#)'
        required
        value={numUsers}
        onInput={(e) => setNumUsers(e.target.value)}
      />
      <Button variant='contained' onClick={() => handleSubmit()}>
        Run
      </Button>
      {/* 
      <Box sx={{ width: 250 }}>
        <Typography id='input-slider' gutterBottom>
          Users to convert (%)
        </Typography>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs>
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby='input-slider'
            />
          </Grid>
          <Grid item>
            <Input
              value={value}
              size='small'
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </Box> */}
    </Box>
  );
};

export default InputSettings;

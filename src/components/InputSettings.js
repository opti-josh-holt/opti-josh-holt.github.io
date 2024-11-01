import React, { useState } from 'react';

import {
  TextField,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
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
  const [sdkKey, setSdkKey] = useState('5D8CK43mj6URqNwwUUGWz');
  const [flagKey, setFlagKey] = useState('product_sort');
  const [numUsers, setNumUsers] = useState(5);
  const [eventKey, setEventKey] = useState('');
  const [numRuns, setNumRuns] = useState(0);
  const [sdkMethod, setSdkMethod] = useState('decide');
  const [attributes, setAttributes] = useState('{"device": "ios"}');

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
    // numRuns handles making decisions when "Run" button is clicked
    setNumRuns(numRuns + 1);
    const formValues = {
      sdkKey: sdkKey === '' ? null : sdkKey,
      flagKey: flagKey === '' ? null : flagKey,
      numUsers: numUsers === '' ? null : numUsers,
      eventKey: eventKey === '' ? null : eventKey,
      sdkMethod: sdkMethod === '' ? null : sdkMethod,
      numRuns: numRuns,
      attributes: attributes
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
        id='key-input'
        label='Key (Flag/Rule/Experiment/Feature)'
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
      <TextField
        id='event-key-input'
        label='Event to mock'
        value={eventKey}
        onInput={(e) => setEventKey(e.target.value)}
      />
        <TextField
        id='attributes-input'
        label='User attributes'
        value={attributes}
        onInput={(e) => setAttributes(e.target.value)}
      />
      <FormControl>
        <FormLabel id='demo-controlled-radio-buttons-group'>
          SDK Method
        </FormLabel>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          value={sdkMethod}
          name='radio-buttons-group'
          onChange={(e) => setSdkMethod(e.target.value)}
        >
          <FormControlLabel value='decide' control={<Radio />} label='Decide' />
          <FormControlLabel
            value='activate'
            control={<Radio />}
            label='Activate'
          />
          <FormControlLabel
            value='isFeatureEnabled'
            control={<Radio />}
            label='IsFeatureEnabled'
          />
        </RadioGroup>
      </FormControl>

      <Button variant='contained' onClick={() => handleSubmit()}>
        Run
      </Button>
    </Box>
  );
};

export default InputSettings;

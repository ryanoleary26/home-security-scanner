import { React, useState } from 'react';
import axios from 'axios';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewScan.css';
import '../global.css';

// Components
import { DataGrid } from '@mui/x-data-grid';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  ButtonGroup,
  Select,
  Stack,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { RotateLeft, Send } from '@mui/icons-material';

function NewScan() {
  const defaultScan = {
    notiComplete: false,
    notiReminders: false,
    toolSelection: [],
    intensity: '',
  };

  const [scan, setScanState] = useState(defaultScan);

  const handleCheckedChange = (e) => {
    setScanState((prevScan) => ({
      ...prevScan,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleIntensityChange = (e) => {
    setScanState((prevScan) => ({
      ...prevScan,
      [e.target.name]: e.target.value,
    }));
  };

  const defaultErrors = {
    toolSelection: false,
    intensity: false,
  };

  const [error, setError] = useState(defaultErrors);

  const clearErrors = () => {
    setError({ ...defaultErrors });
  };

  const clearForm = () => {
    setScanState({ ...defaultScan });
    setError({ ...defaultErrors });
  };

  // const toolValidator = (tools) => {
  //   console.log('       In toolValidator');
  //   if (tools.length === 0) {
  //     console.log('           ⚠️Tool Selection invalid');
  //     setError((prevError) => ({
  //       ...prevError,
  //       toolSelection: true,
  //     }));
  //     return false;
  //   } else {
  //     console.log('           ✅ all good here chief');
  //     return true;
  //   }
  // };

  // const intensityValidator = (inten) => {
  //   console.log('       In intensityValidator');
  //   if (inten.length === 0) {
  //     console.log('           ⚠️Intensity invalid');
  //     setError((prevError) => ({
  //       ...prevError,
  //       intensity: true,
  //     }));
  //     return false;
  //   } else {
  //     console.log('           ✅ all good here chief');
  //     return true;
  //   }
  // };

  const validateState = () => {
    // console.log('👉 Inside validateState()');
    let isValid = true;
    clearErrors();
    if (scan.intensity === '') {
      // console.log('       ⚠️Intensity invalid');
      setError((prevError) => ({
        ...prevError,
        intensity: true,
      }));
      isValid = false;
    }
    if (scan.toolSelection.length === 0) {
      // console.log('       ⚠️Tool Selection invalid');
      setError((prevError) => ({
        ...prevError,
        toolSelection: true,
      }));
      isValid = false;
    }
    // console.log('👈 Leaving validateState()');
    return isValid;
  };

  const submit = () => {
    clearErrors();
    // console.clear();
    // console.log('📞Calling validateState()');
    if (validateState() === false) {
      // console.log('❌ validateState() returned false');
      // show error notification?
    } else {
      // console.log('✅ all good here chief');
      // show success notification
      clearErrors();
      // console.log(`Sending ${JSON.stringify(scan, null, 4)}`);
      const newScanData = {
        notiComplete: scan.notiComplete,
        notiReminders: scan.notiReminders,
        toolSelection: scan.toolSelection,
        intensity: scan.intensity,
      };
      axios.post('/api/newScan', newScanData);
      // .then((response) => {
      //   console.log(`Received response ${response.status}`);
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
      clearForm();
    }
  };

  // TODO Replace with database interaction
  const toolColumns = [
    {
      field: 'toolName',
      headerName: 'ID',
      description: 'The name of the tool that you want to include.',
      sortable: false,
      width: 100,
    },
    {
      field: 'description',
      headerName: 'Description',
      description: 'Tool description.',
      sortable: false,
      width: 300,
    },
  ];
  // TODO Replace with database interaction
  const toolRows = [
    { id: 1, toolName: 'nmap', description: 'Network mapper tool' },
    { id: 2, toolName: 'masscan', description: 'Scan larger networks' },
  ];

  const handleToolChange = (selectedTools) => {
    // TODO replace rows with reference to a database fetch maybe?
    setScanState((prevScan) => ({
      ...prevScan,
      toolSelection: selectedTools.map((selected) => toolRows[selected - 1]),
    }));
  };

  return (
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section>
          <h1>New Scan</h1>
          <p>Create a new scan to run immediately.</p>
        </section>
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Box sx={{ minWidth: 120 }}>
          <Stack spacing={5} direction="column">
            <FormLabel id="tool-selector-label">Tool Selection</FormLabel>
            <div style={{ height: 300, width: '100%' }}>
              <DataGrid
                rows={toolRows}
                columns={toolColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableColumnFilter
                disableColumnSelector
                onSelectionModelChange={handleToolChange}
                selectionModel={scan.toolSelection.map((tool) => tool.id)}
              />

              <FormHelperText
                id="component-error-text"
                error={error.toolSelection}
              >
                * Tool Selection is required
              </FormHelperText>
            </div>

            <FormLabel>Scan Intensity</FormLabel>
            <FormControl>
              <InputLabel id="scan-intensity-label">Select</InputLabel>
              <Select
                name="intensity"
                id="intensity"
                label="Intensity"
                required
                error={error.intensity}
                value={scan.intensity}
                onChange={handleIntensityChange}
                labelId="scan-intensity-label"
              >
                <MenuItem value="intense">Intense</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="light">Light</MenuItem>
              </Select>
            </FormControl>

            <FormGroup>
              <FormLabel component="legend">
                Scan Notification Settings
              </FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    name="notiComplete"
                    id="notiComplete"
                    checked={scan.notiComplete}
                    onChange={handleCheckedChange}
                  />
                }
                label="Scan complete/failed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="notiReminders"
                    id="notiReminders"
                    checked={scan.notiReminders}
                    onChange={handleCheckedChange}
                  />
                }
                label="Scan reminders"
              />
            </FormGroup>
          </Stack>
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{ marginTop: 2 }}
        >
          <Button variant="contained" startIcon={<Send />} onClick={submit}>
            Submit
          </Button>
          <Button
            variant="contained"
            startIcon={<RotateLeft />}
            onClick={clearForm}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default NewScan;

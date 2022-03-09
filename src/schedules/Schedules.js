// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './Schedules.css';
import '../global.css';

// Components
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  FormControl, InputLabel, Input, FormHelperText, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { DataGrid } from '@mui/x-data-grid';

function Schedules() {
  // Frequency selector state management
  const [frequency, setFrequency] = useState('');

  // Date state management
  const [date, setDate] = useState(new Date());
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Notification checkbox state management
  const [notificationState, setNotificationState] = useState({
    complete: false,
    reminders: false,
  });

  const handleNotificationChange = (event) => {
    setNotificationState({
      ...notificationState,
      [event.target.name]: event.target.checked,
    });
  };

  const { complete, reminders } = notificationState;

  // Scan intensity checkbox state management
  const [intensityState, setIntensityState] = useState({
    intense: false,
    moderate: false,
    light: false,
  });

  const handleIntensityChange = (event) => {
    setIntensityState({
      ...intensityState,
      [event.target.name]: event.target.checked,
    });
  };

  const { intense, moderate, light } = intensityState;
  const error = [intense, moderate, light].filter((v) => v).length !== 1;

  const columns = [
    {
      field: 'toolName',
      headerName: 'ID',
      description: 'The name of the tool that you want to include.',
      sortable: false,
      width: 100,
      hideable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      description: 'Tool description.',
      sortable: false,
      width: 300,
      hideable: false,
      filterabe: false,
    },
  ];

  const rows = [
    { id: 1, toolName: 'nmap', description: 'Network mapper tool' },
    { id: 2, toolName: 'masscan', description: 'Scan larger networks' },
  ];

  return (
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section>
          <h1>Scan Schedules</h1>
          <p>Create and manage scanning schedules.</p>
        </section>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h2>Create a new schedule</h2>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box sx={{ minWidth: 120 }}>
              <Stack spacing={3}>
                <p>Select schedule data and frequency</p>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Choose schedule start date and time"
                    value={date}
                    minDateTime={new Date()}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {/* <p>Selected date: {date.toString()}</p> */}
                </LocalizationProvider>

                <FormControl>
                  <InputLabel id="scan-frequency">Scan Frequency</InputLabel>
                  <Select
                    labelId="scan-frequenc-label"
                    id="scan-frequency"
                    value={frequency}
                    label="Frequency"
                    onChange={(e) => { setFrequency(e.target.value); }}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                  </Select>
                  {/* <p>Selected schedule frequency: {frequency}</p> */}
                </FormControl>
                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                  <FormLabel component="legend">Scan Notification Settings</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={complete} onChange={handleNotificationChange} name="complete" />
                          }
                      label="Scan complete/failed"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={reminders} onChange={handleNotificationChange} name="reminders" />
                          }
                      label="Scan reminders"
                    />
                  </FormGroup>
                </FormControl>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box sx={{ minWidth: 120 }}>
              <Stack spacing={3}>
                <p>Tool Selection</p>
                <div style={{ height: 300, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                  />
                </div>
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                  error={error}
                >
                  <FormLabel component="legend">Scan Intensity</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={intense} onChange={handleIntensityChange} name="intense" />
                          }
                      label="Intense"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={moderate} onChange={handleIntensityChange} name="moderate" />
                          }
                      label="Moderate"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={light} onChange={handleIntensityChange} name="light" />
                          }
                      label="Light"
                    />
                  </FormGroup>

                </FormControl>

              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h2>Modify current schedule</h2>
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default Schedules;

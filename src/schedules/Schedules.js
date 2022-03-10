/* eslint-disable react/jsx-props-no-spreading */

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './Schedules.css';
import '../global.css';

// Components
import { React, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { DataGrid } from '@mui/x-data-grid';
import { RotateLeft, Send } from '@mui/icons-material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function Schedules() {
  const defaultSchedule = {
    scanStart: new Date(),
    frequency: 'weekly',
    notiComplete: false,
    notiReminders: false,
    toolSelection: [],
    intensity: 'moderate',
  };

  const [schedule, setSchedule] = useState(defaultSchedule);

  // console.log(`Initial schedule: ${JSON.stringify(schedule, null, 2)}`);

  const handleScheduleChange = (e) => {
    // console.log(`Setting: ${e.target.name} to: ${e.target.value}`);
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckedChange = (e) => {
    // console.log(`Setting checked of ${e.target.name} to: ${e.target.checked}`);
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDateChange = (date) => {
    // console.log(`Setting date to: ${date}`);
    setSchedule({
      ...schedule,
      scanStart: date,
    });
  };

  // Replace with database interaction
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
  // Replace with database interaction
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
                    name="scanStart"
                    id="scanStart"
                    label="Choose schedule start date and time"
                    value={schedule.scanStart}
                    minDateTime={new Date()}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {/* <p>Selected date: {date.toString()}</p> */}
                </LocalizationProvider>

                <InputLabel id="scan-frequency">Scan Frequency</InputLabel>
                <Select
                  labelId="scan-frequency-label"
                  id="frequency"
                  name="frequency"
                  label="Frequency"
                  value={schedule.frequency}
                  onChange={handleScheduleChange}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
                {/* <p>Selected schedule frequency: {frequency}</p> */}

                <FormLabel component="legend">
                  Scan Notification Settings
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="notiComplete"
                        id="notiComplete"
                        checked={schedule.notiComplete}
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
                        checked={schedule.notiReminders}
                        onChange={handleCheckedChange}
                      />
                    }
                    label="Scan reminders"
                  />
                </FormGroup>
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
                <FormControl>
                  <InputLabel id="scan-intensity">Scan Intensity</InputLabel>
                  <Select
                    labelId="scan-intensity-label"
                    name="intensity"
                    id="intensity"
                    label="Intensity"
                    value={schedule.intensity}
                    onChange={handleScheduleChange}
                  >
                    <MenuItem value="intense">Intense</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                  </Select>
                  {/* <p>Selected schedule frequency: {frequency}</p> */}
                </FormControl>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button variant="contained" startIcon={<Send />}>
            Submit
          </Button>
          <Button variant="contained" startIcon={<RotateLeft />}>
            Reset
          </Button>
        </ButtonGroup>
      </Grid>

      {/* Modify schedule section */}
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h2>Modify current schedule</h2>
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          <FormHelperText id="my-helper-text">
            We`&apos;`ll never share your email.
          </FormHelperText>
        </FormControl>
      </Grid>
      {/*  */}
    </Grid>
  );
}

export default Schedules;

/* eslint-disable react/jsx-props-no-spreading */

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './Schedules.css';
import '../global.css';

// Components
import { React, useState } from 'react';
import axios from 'axios';
import { isValid as validateDate, format } from 'date-fns';
import {
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  // Input,
  FormHelperText,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  ButtonGroup,
  Select,
  Stack,
  MenuItem,
  Alert,
  Snackbar,
  Fade,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DataGrid } from '@mui/x-data-grid';
import { RotateLeft, Send } from '@mui/icons-material';

function Schedules() {
  const [snackState, setSnackState] = useState({
    open: false,
    Transition: Fade,
    message: 'message',
    type: 'error',
  });

  const showSnack = (snackMsg, snackType) => {
    setSnackState({
      open: true,
      Transition: Fade,
      message: snackMsg,
      type: snackType,
    });
  };

  const hideSnack = () => {
    setSnackState({
      ...snackState,
      open: false,
    });
  };

  const defaultSchedule = {
    scanStart: new Date(),
    frequency: '',
    notiComplete: false,
    notiReminders: false,
    toolSelection: [],
    intensity: '',
  };

  const [schedule, setScheduleState] = useState(defaultSchedule);

  const handleScheduleChange = (e) => {
    // console.log(`Setting: ${e.target.name} to: ${e.target.value}`);
    setScheduleState({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckedChange = (e) => {
    // console.log(`Setting checked of ${e.target.name} to: ${e.target.checked}`);
    setScheduleState({
      ...schedule,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDateChange = (date) => {
    // Date object
    // console.log(`Setting date to: ${date}`);
    // console.log(typeof date);
    // console.log(isValid(date));

    // Convert date object to string
    const formattedDate = format(date, 'HH:mm:ss dd/MM/yyyy OOOO');
    // console.log(formattedDate);
    // console.log(typeof formattedDate);
    // console.log(isValid(formattedDate));

    // Convert string to new date object
    // const newFormattedDate = new Date(formattedDate);
    // console.log(newFormattedDate);
    // console.log(typeof newFormattedDate);
    // console.log(isValid(newFormattedDate));

    setScheduleState({
      ...schedule,
      scanStart: formattedDate,
    });
  };

  const defaultErrors = {
    toolSelection: false,
    intensity: false,
    frequency: false,
    scanStart: false,
  };

  const [error, setError] = useState(defaultErrors);

  const clearErrors = () => {
    setError({ ...defaultErrors });
  };

  const clearForm = () => {
    setScheduleState({ ...defaultSchedule });
    setError({ ...defaultErrors });
  };

  // TODO: Replace with database interaction
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
  // TODO: Replace with database interaction
  const toolRows = [
    { id: 1, toolName: 'nmap', description: 'Network mapper tool' },
    { id: 2, toolName: 'masscan', description: 'Scan larger networks' },
  ];

  const handleToolChange = (selectedTools) => {
    // TODO: replace rows with reference to a database fetch maybe?
    setScheduleState({
      ...schedule,
      toolSelection: selectedTools.map((selected) => toolRows[selected - 1]),
    });
  };

  const validateState = () => {
    // console.log('👉 Inside validateState()');
    let isScheduleValid = true;
    clearErrors();
    if (schedule.intensity === '') {
      // console.log('       ⚠️Intensity invalid');
      setError((prevError) => ({
        ...prevError,
        intensity: true,
      }));
      isScheduleValid = false;
    }
    if (schedule.frequency === '') {
      // console.log('       ⚠️Frequency invalid');
      setError((prevError) => ({
        ...prevError,
        frequency: true,
      }));
      isScheduleValid = false;
    }
    if (!validateDate(new Date(schedule.scanStart))) {
      // console.log('       ⚠️Scan start invalid');
      setError((prevError) => ({
        ...prevError,
        scanStart: true,
      }));
      isScheduleValid = false;
    }
    if (schedule.toolSelection.length === 0) {
      // console.log('       ⚠️Tool Selection invalid');
      setError((prevError) => ({
        ...prevError,
        toolSelection: true,
      }));
      isScheduleValid = false;
    }
    // console.log('👈 Leaving validateState()');
    return isScheduleValid;
  };

  const submit = () => {
    clearErrors();
    // console.clear();
    // console.log('📞Calling validateState()');
    if (validateState() === false) {
      // console.log('❌ validateState() returned false');
      // show error notification?
      // console.log(error);
      showSnack('An error occured', 'error');
    } else {
      // console.log('✅ all good here chief');
      // show success notification
      clearErrors();
      // console.log(`Sending ${JSON.stringify(schedule, null, 4)}`);
      // const newScheduleData = {
      //   scanStart: schedule.scanStart,
      //   frequency: schedule.frequency,
      //   notiComplete: schedule.notiComplete,
      //   notiReminders: schedule.notiReminders,
      //   toolSelection: schedule.toolSelection,
      //   intensity: schedule.intensity,
      // };
      axios.post('/schedule/newSchedule', schedule).then((response) => {
        // console.log(`Received response ${response.status}`);
        if (response.status === 200) {
          showSnack(
            `Succesfuly submitted! ${response.data.message} `,
            'success',
          );
        } else {
          showSnack(`An error occured ${response.status}`, 'error');
        }
      });
      // .catch((err) => {
      //   console.log(err);
      // });
      clearForm();
    }
  };

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
              <Stack spacing={2}>
                <FormLabel>Select schedule data and frequency</FormLabel>
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
                </LocalizationProvider>

                <FormLabel sx={{ marginTop: '32px' }}>Scan Frequency</FormLabel>
                <FormControl>
                  <InputLabel id="scan-frequency-label">Select</InputLabel>
                  <Select
                    labelId="scan-frequency-label"
                    id="frequency"
                    name="frequency"
                    label="Frequency"
                    value={schedule.frequency}
                    onChange={handleScheduleChange}
                    error={error.frequency}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
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
              <Stack spacing={2} direction="column">
                <FormLabel>Tool Selection</FormLabel>
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
                    selectionModel={schedule.toolSelection.map(
                      (tool) => tool.id,
                    )}
                  />
                  <FormHelperText
                    id="component-error-text"
                    error={error.toolSelection}
                  >
                    * Tool Selection is required
                  </FormHelperText>
                </div>

                <FormLabel sx={{ marginTop: '32px' }}>Scan Intensity</FormLabel>
                <FormControl>
                  <InputLabel id="scan-intensity-label">Select</InputLabel>
                  <Select
                    name="intensity"
                    id="intensity"
                    label="Intensity"
                    value={schedule.intensity}
                    onChange={handleScheduleChange}
                    labelId="scan-intensity-label"
                    error={error.intensity}
                  >
                    <MenuItem value="intense">Intense</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Grid>
        </Grid>
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

        <Snackbar
          open={snackState.open}
          onClose={hideSnack}
          autoHideDuration={6000}
          TransitionComponent={snackState.Transition}
          key={snackState.Transition.name}
        >
          <Alert
            onClose={hideSnack}
            severity={snackState.type}
            sx={{ width: '100%' }}
          >
            {snackState.message}
          </Alert>
        </Snackbar>
      </Grid>

      {/* Modify schedule section */}
      {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h2>Modify current schedule</h2>
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          <FormHelperText id="my-helper-text">
            We`&apos;`ll never share your email.
          </FormHelperText>
        </FormControl>
      </Grid> */}
      {/*  */}
    </Grid>
  );
}

export default Schedules;

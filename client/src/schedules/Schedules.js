/* eslint-disable react/jsx-props-no-spreading */

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './Schedules.css';
import '../global.css';

// Components
import { React, useEffect, useState, useMemo } from 'react'; // eslint-disable-line object-curly-newline
import axios from 'axios';
import { isValid as validateDate, format } from 'date-fns';
import {
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DataGrid } from '@mui/x-data-grid';
import { RotateLeft, Send, Delete } from '@mui/icons-material';

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
    // Convert date object to string
    // const formattedDate = format(date, 'HH:mm:ss dd/MM/yyyy OOOO');
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
      scanStart: date,
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

  const [loadingScheduleData, setLoadingScheduleData] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const columns = useMemo(() => [
    {
      Header: 'Schedule ID',
      id: 1,
    },
    {
      Header: 'Start Date/Time',
      id: 2,
    },
    {
      Header: 'Tool Selection',
      id: 3,
    },
    {
      Header: 'Scan Frequency',
      id: 4,
    },
    {
      Header: 'Scan Intensity',
      id: 5,
    },
    {
      Header: 'Complete/Failed Notifications',
      id: 6,
    },
    {
      Header: 'Reminder Notifications',
      id: 7,
    },
  ]);

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
      showSnack('The form contains invalid data. Please check your selections, and try again.', 'error');
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
      try {
        axios.post('/schedule/newSchedule', schedule).then((response) => {
        // console.log(`Received response ${response.status}`);
          if (response.status === 200) {
            showSnack(
              `Succesfuly submitted! ${response.data.message} `,
              'success',
            );
            setLoadingScheduleData(true);
            clearForm();
          } else {
            showSnack(`An error occured ${response.status}`, 'error');
          }
        });
      } catch (e) {
        showSnack(`An error occured ${e}`, 'error');
      }
    }
  };

  const deleteSchedules = () => {
    try {
      axios.post('/schedule/deleteSchedules', schedule).then((response) => {
        // console.log(`Received response ${response.status}`);
        if (response.status === 200) {
          showSnack(
            `${response.data.message} `,
            'success',
          );
        } else {
          showSnack(`An error occured ${response.status}`, 'error');
        }
      });
    } catch (e) {
      showSnack(`An error occured ${e}`, 'error');
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        await axios.get('/schedule/getSchedules').then((response) => {
          switch (response.status) {
            case 200:
              // console.log(response.data.schedules);
              setScheduleData(response.data);
              setLoadingScheduleData(false);
              break;

            case 204:
              showSnack('There are no schedule records to show', 'info');
              break;

            default:
              showSnack('Recieved an unexpected response from API', 'error');
          }
        });
      } catch (e) {
        showSnack(`Could not reach API. \n${e} `, 'error');
      }
    }
    if (loadingScheduleData) {
      getData();
    }
  }, [loadingScheduleData]);

  return (
    <Grid container spacing={2} sx={{ paddingBottom: 30 }}>
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
                    mask="HH:mm:ss dd/MM/yyyy OOOO"
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
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
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
                    <MenuItem value="Intense">Intense</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Light">Light</MenuItem>
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
          // autoHideDuration={6000}
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
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid
          justifyContent="space-between"
          container
        >
          <Grid item>
            {loadingScheduleData ? (
              <h2>Existing Schedules &#40;?&#41; </h2>
            ) : (
              <h2>
                Existing Schedules &#40;
                {scheduleData.docCount}
                &#41;
              </h2>
            )}
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Delete />}
              color="error"
              onClick={deleteSchedules}
              sx={{ marginBottom: '24px' }}
            >
              Delete all Schedules
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id}>{col.Header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingScheduleData ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                scheduleData.schedules.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row._id}</TableCell>
                    <TableCell component="th" scope="row">
                      {format(new Date(row.scanStart), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {row.toolSelection.map((tool) => (
                        <li key={tool.id}>{tool.toolName}</li>
                      ))}
                    </TableCell>
                    <TableCell>{row.frequency}</TableCell>
                    <TableCell>{row.intensity}</TableCell>
                    <TableCell>{row.notiComplete ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{row.notiReminders ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <DataGrid
          rows={scheduleData.schedules}
          columns={newColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id} // eslint-disable-line no-underscore-dangle
        /> */}
      </Grid>
      {/*  */}
    </Grid>
  );
}

export default Schedules;

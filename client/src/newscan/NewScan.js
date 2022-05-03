/* eslint max-len: ["error", { "code": 120 }] */
import {
  React,
  useState,
  useMemo,
  useEffect,
} from 'react';
import axios from 'axios';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewScan.css';
import '../global.css';

// Components
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
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
  IconButton,
  Select,
  Stack,
  MenuItem,
  FormHelperText,
  Snackbar,
  Fade,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { RotateLeft, Send } from '@mui/icons-material';

function TablePaginationActions(props) {
  const theme = useTheme();
  const {
    count,
    page,
    rowsPerPage,
    onPageChange,
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function NewScan() {
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

  const [loadingScanData, setLoadingScanData] = useState(true);
  const [scanData, setScanData] = useState([]);
  const [scanError, setScanError] = useState({
    error: false,
    message: '',
  });

  const columns = useMemo(() => [
    {
      Header: 'Scan ID',
      id: 1,
    },
    {
      Header: 'Scan Date/Time',
      id: 2,
    },
    {
      Header: 'Tool Selection',
      id: 3,
    },
    {
      Header: 'Scan Intensity',
      id: 4,
    },
    {
      Header: 'Complete/Failed Notifications',
      id: 5,
    },
    {
      Header: 'Reminder Notifications',
      id: 6,
    },
  ]);

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

  const [backdropState, setBackdropState] = useState(false);

  // const handleBackdrop = () => {
  //   setBackdropState(false);
  // }
  // const handleBackdropToggle = () => {
  //   setBackdropState(!backdropState);
  // }

  const submit = () => {
    clearErrors();
    if (validateState() === false) {
      showSnack('The form contains invalid data. Please check your selections, and try again.', 'error');
    } else {
      clearErrors();
      const newScanData = {
        notiComplete: scan.notiComplete,
        notiReminders: scan.notiReminders,
        toolSelection: scan.toolSelection,
        intensity: scan.intensity,
        scanDate: new Date(),
      };
      try {
        setBackdropState(true);
        axios.post('/scan/newScan', newScanData, { timeout: 1200000 }).then((response) => { // timeout of 20 mins
          if (response.status === 200) {
            showSnack(
              `Succesfuly submitted! ${response.data.message} `,
              'success',
            );
            setLoadingScanData(true);
            setBackdropState(false);
            clearForm();
          } else {
            showSnack(`An error occured ${response.status}`, 'error');
            setBackdropState(false);
          }
        }).catch((axiosError) => {
          showSnack(`Error connecting to API: ${axiosError}`, 'error');
          setBackdropState(false);
        });
      } catch (e) {
        showSnack(` ${e}`, 'error');
        setBackdropState(false);
      }
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
    // { id: 2, toolName: 'masscan', description: 'Scan larger networks' },
  ];

  const handleToolChange = (selectedTools) => {
    // TODO replace rows with reference to a database fetch maybe?
    setScanState((prevScan) => ({
      ...prevScan,
      toolSelection: selectedTools.map((selected) => toolRows[selected - 1]),
    }));
  };

  useEffect(() => {
    async function getData() {
      try {
        await axios.get('/scan/getScans', { timeout: 20000 }).then((response) => {
          switch (response.status) {
            case 200:
              setScanData(response.data);
              setLoadingScanData(false);
              break;
            case 204:
              setScanError({ error: true, message: 'No records.' });
              break;
            default:
              showSnack('Recieved an unexpected response from API', 'error');
          }
        });
      } catch (err) {
        setScanError({ error: true, message: `${err}` });
        showSnack(`Error connecting to API: ${err} `, 'error');
      }
    }
    if (loadingScanData) {
      getData();
    }
  }, [loadingScanData]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - scanData.scans.length) : 0; //eslint-disable-line spaced-comment, max-len

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <Stack spacing={2} direction="column">
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

            <FormLabel sx={{ marginTop: '32px' }}>Scan Intensity</FormLabel>
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
                <MenuItem value="Intense">Intense</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Light">Light</MenuItem>
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

      {/* Scan History section */}
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {loadingScanData ? (
          <h2>Scan History &#40;?&#41; </h2>
        ) : (
          <h2>
            Scan History &#40;
            {scanData.docCount}
            &#41;
          </h2>
        )}

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
              {loadingScanData ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {scanError.error ? <p>{scanError.message}</p> : <CircularProgress />}
                    {/* <CircularProgress /> */}
                  </TableCell>
                </TableRow>
              ) : (
                // scanData.scans.map((row) => (
                (rowsPerPage > 0
                  ? scanData.scans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse()
                  : scanData.scans.reverse()
                ).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row._id}</TableCell>
                    <TableCell>{format(new Date(row.scanDate), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>
                      {row.toolSelection.map((tool) => (
                        <li key={tool.id}>{tool.toolName}</li>
                      ))}
                    </TableCell>
                    <TableCell>{row.intensity}</TableCell>
                    <TableCell>{row.notiComplete ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{row.notiReminders ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={5}
                  count={scanData.scans ? scanData.scans.length : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
      <Backdrop open={backdropState}>
        <CircularProgress />
      </Backdrop>
      {/*  */}
    </Grid>
  );
}

export default NewScan;

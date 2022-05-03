// eslint-disable react/prop-types react/destructuring-assignment
import {
  React,
  useState,
  useEffect,
} from 'react';
import axios from 'axios';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReportTemplate.css';
import '../../global.css';

// Components
import {
  Grid,
  Snackbar,
  Fade,
  Alert,
  CircularProgress,
  Button,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from '@mui/material';
import { format, millisecondsToMinutes } from 'date-fns';

// Icons
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ReportTemplate() {
  const [loadingReportData, setLoadingReportData] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [reportError, setReportError] = useState({
    error: false,
    message: '',
  });

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

  // Retrieve id from URL
  const params = (new URL(document.location)).searchParams;
  const reportID = params.get('id');

  useEffect(() => {
    async function getData() {
      try {
        if (reportID === null || reportID === undefined || reportID.length === 0) {
          showSnack('Could not find Report ID URL parameter', 'error');
        }
        await axios.get(`/report/singleReport/${reportID}`, { timeout: 20000 }).then((response) => {
          switch (response.status) {
            case 200:
              setReportData(response.data);
              setLoadingReportData(false);
              break;
            case 204:
              setReportError({ error: true, message: 'No records.' });
              break;
            default:
              showSnack('Recieved an unexpected response from API', 'error');
          }
        });
      } catch (err) {
        setReportError({ error: true, message: `${err}` });
        showSnack(`${err} `, 'error');
      }
    }
    if (loadingReportData) {
      getData();
    }
  }, [loadingReportData]);

  return (
    <Grid container sx={{ marginBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            href="/report"
            sx={{ marginBottom: 2 }}
          >
            Back
          </Button>
          <h1>
            Report ID: {reportID}
          </h1>
        </section>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {loadingReportData ? (
            // waiting for data to load
            <div>
              {reportError.error ? <p>{reportError.message}</p> : <CircularProgress />}
            </div>
          ) : (
            // data has loaded
            <>
              <Report data={reportData} />
              <div>
                <Stack sx={{ justifyContent: 'center' }}>
                  <KeyboardArrowUpIcon sx={{ alignSelf: 'center' }} fontSize="large" />
                  <Button
                    variant="contained"
                    sx={{ alignSelf: 'center' }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Scroll to the top
                  </Button>
                </Stack>
              </div>
            </>
          )}
        </Grid>
      </Grid>

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
  );
}

function Report(props) {
  const data = props.data.response;
  // console.log(data);
  return (
    <Grid container spacing={4} sx={{ paddingBottom: 5 }}>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <h2>Quick Summary</h2>
        <p>Hover over each cell for descriptions.</p>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
        <Table sx={{ '&:last-child tr': { backgroundColor: '#ffffff' } }}>
          <TableBody>
            <TableRow>
              <TableCell title="Version of the tool used for this scan." variant="head">Nmap Version</TableCell>
              <TableCell>{data.version.toString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Scan start time</TableCell>
              <TableCell>{format(new Date(data.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>

            </TableRow>
            <TableRow>
              <TableCell variant="head">Scan duration</TableCell>
              <TableCell>{millisecondsToMinutes(data.duration)} minutes</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Scan arguments</TableCell>
              <TableCell>{data.nmapArguments.toString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Scan ID</TableCell>
              <TableCell>{data.scanID.toString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell title="The number of devices identified in this scan." variant="head">Hosts discovered</TableCell>
              <TableCell>{data.hosts.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <h2>Host Summary</h2>
        <p>Hover over each cell for descriptions.</p>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
        <Grid container spacing={3}>
          {data.hosts.map((host, index) => (
            <Grid key={host.ipAddress} item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }} elevation={3}>
                <h3>Host #{index + 1}</h3>
                <h5>Details</h5>
                <Table sx={{ tr: { backgroundColor: '#ffffff' }, marginBottom: 5 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell title="This is the address that the device uses to communicate across your home network." variant="head">IP Address</TableCell>
                      <TableCell>{host.ipAddress ? host.ipAddress : 'Not available'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell title="The unique identifier for the device identified." variant="head">MAC Address</TableCell>
                      <TableCell>{host.mac ? host.mac : 'Not available'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell title="The likely manufacturer or vendor of the device." variant="head">Device Vendor</TableCell>
                      <TableCell>{host.vendor ? host.vendor : 'Not available'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        title="The ports and associated services that have been identified on this device."
                        rowSpan={host.ports.length !== 0 ? host.ports.length + 1 : 2}
                        variant="head"
                      >
                        Open/Identified Ports
                      </TableCell>
                    </TableRow>

                    {host.ports.length !== 0 ? (host.ports.map((port) => (
                      <TableRow key={port.number}>
                        <TableCell>
                          <p>Port number: {port.number}</p>
                          <p title={`The service that is found on port ${port.number}`}>Service: {port.service.toUpperCase()}</p>
                          <p>Protocol: {port.protocol.toUpperCase()}</p>
                          <p><u>Vulnerability Data</u></p>
                          {
                            port.script !== undefined
                              ? (
                                Object.keys(port.script).map((key) => {
                                  let output;
                                  if (port.script[key].id === undefined && port.script[key].output === undefined) {
                                    output = <p key={key}> <a target="_blank" rel="noreferrer" href={`https://nmap.org/nsedoc/scripts/${port.script.id}.html`}>{port.script.id}</a> - {port.script.output.includes('ERROR') ? 'This script didn\'t execute' : port.script.output}</p>;
                                  } else {
                                    output = <p key={key}> <a target="_blank" rel="noreferrer" href={`https://nmap.org/nsedoc/scripts/${port.script[key].id}.html`}>{port.script[key].id}</a> - {port.script[key].output.includes('ERROR') ? 'This script didn\'t execute' : port.script[key].output}</p>;
                                  }
                                  return output;
                                })
                              )
                              : <p>No information available</p>
                          }
                          {/* Check if the port has a script attachment */}
                        </TableCell>
                      </TableRow>
                    ))) : (
                      <TableRow>
                        <TableCell>No ports detected</TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ReportTemplate;

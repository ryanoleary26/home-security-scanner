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
} from '@mui/material';
import { millisecondsToMinutes } from 'date-fns';

// Icons
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

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
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section>
          <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} href="/report">
            Back
          </Button>
          <h1>
            Report ID: {reportID}
          </h1>
          {loadingReportData ? (
            // waiting for data to load
            <div>
              {reportError.error ? <p>{reportError.message}</p> : <CircularProgress />}
            </div>
          ) : (
            // data has loaded
            <Report data={reportData} />
          )}
        </section>
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
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h2>Quick Summary</h2>
        <p>Nmap version: {data.version.toString()}</p>
        <p>Scan start date and time: {data.timestamp.toString()}</p>
        <p>Scan duration: {millisecondsToMinutes(data.duration)} minutes</p>
        <p>Hosts discovered: {data.hosts.length}</p>
        <p>Nmap scan arguments: {data.nmapArguments.toString()}</p>
        <p>Scan ID: {data.scanID.toString()}</p>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h2>Host Summary</h2>
        {data.hosts.map((host) => (
          <div>
            <hr />
            <h3>Host Information</h3>
            <p>IP Address: {host.ipAddress}</p>
            <p>MAC Address: {host.mac}</p>
            <p>Device Vendor: {host.vendor}</p>
            <h3>Ports Identified</h3>
            {host.ports.length !== 0 ? (host.ports.map((port) => (
              <ul>
                <li>{port.number}</li>
                <li>{port.service}</li>
                <li>{port.protocol}</li>
              </ul>
            ))) : (<p>No ports detected</p>)}
            { }
            {/* <p>{host.ports.length}</p> */}
          </div>
        ))}
      </Grid>
    </Grid>
  );
}

export default ReportTemplate;

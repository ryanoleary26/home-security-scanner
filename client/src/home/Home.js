/* eslint-disable react/jsx-props-no-spreading */

// import React from 'react';
import React from 'react';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import '../global.css';

// Components
import Button from '@mui/material/Button/';
import SearchIcon from '@mui/icons-material/Search';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

// {
//   <link
//   rel="stylesheet"
//   href="https://fonts.googleapis.com/icon?family=Material+Icons"
// />
// }

function createData(scanNo, scanDate, scanDev, scanVuln, scanReport) {
  return {
    scanNo,
    scanDate,
    scanDev,
    scanVuln,
    scanReport,
  };
}

// Replace with database query
const rows = [
  createData(1, '01/01/22', 3, 4, 'Full report'),
  createData(2, '01/02/22', 6, 4, 'Full report'),
  createData(3, '01/03/22', 10, 5, 'Full report'),
  createData(4, '01/04/22', 11, 6, 'Full report'),
  createData(5, '01/05/22', 10, 5, 'Full report'),
];

function Home() {
  return (
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section id="overview">
          <h1>Scan Overview</h1>
          <TableContainer sx={{ maxWidth: 900 }} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Scan No.</TableCell>
                  <TableCell>Scan Date</TableCell>
                  <TableCell>Devices Scanned</TableCell>
                  <TableCell>Vulnerable Devices</TableCell>
                  <TableCell>Full Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.scanNo}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.scanNo}
                    </TableCell>
                    <TableCell>{row.scanDate}</TableCell>
                    <TableCell>{row.scanDev}</TableCell>
                    <TableCell>{row.scanVuln}</TableCell>
                    <TableCell>{row.scanReport}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section id="newscan">
          <h1>New Scan</h1>
          <p>Click the button below to initiate a new scan.</p>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            href="/newscan"
          >
            New Scan
          </Button>
        </section>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section id="schedulescan">
          <h1>Schedule a Scan</h1>
          <p>Click the button below to create a new scan schedule.</p>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            href="/schedules"
            disabled
          >
            New Schedule
          </Button>
        </section>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section id="modifyschedule">
          <h1>Modify a Scheduled Scan</h1>
          <p>
            Click the button below to modify or delete an existing scan
            schedule.
          </p>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            href="/schedules#modify"
            disabled
          >
            Modify Schedule
          </Button>
        </section>
      </Grid>
    </Grid>
  );
}

export default Home;

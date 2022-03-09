import React from 'react';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './Results.css';
import '../global.css';

// Components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function createData(scanNo, scanDate, scanDev, scanVuln, scanReport) {
  return {
    scanNo, scanDate, scanDev, scanVuln, scanReport,
  };
}

// Replace with database query
const rows = [
  createData(1, '01/01/22', 3, 4, 'Full report'),
  createData(2, '01/02/22', 6, 4, 'Full report'),
  createData(3, '01/03/22', 10, 5, 'Full report'),
  createData(4, '01/04/22', 11, 6, 'Full report'),
  createData(5, '01/05/22', 10, 5, 'Full report'),
  createData(6, '01/01/22', 3, 4, 'Full report'),
  createData(7, '01/02/22', 6, 4, 'Full report'),
  createData(8, '01/03/22', 10, 5, 'Full report'),
  createData(9, '01/04/22', 11, 6, 'Full report'),
  createData(10, '01/05/22', 10, 5, 'Full report'),
];

function Results() {
  return (
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section>
          <h1>Scan Results</h1>
          <TableContainer sx={{ maxWidth: 900, maxHeight: 400 }} component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
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
                    <TableCell>
                      <a href="#a">
                        { row.scanReport }
                        -`&gt;`
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section className="keyResult">
          <h1>Key Results</h1>
        </section>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section className="keyResult">
          <div>
            <h2>Most common device types</h2>
            <TableContainer sx={{ maxWidth: 900, maxHeight: 400 }} component={Paper}>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Product Page</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>a</TableCell>
                    <TableCell>a</TableCell>
                    <TableCell>a</TableCell>
                    <TableCell>a</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </section>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section className="keyResult">
          <div>
            <h2>Devices requiring attention</h2>
            <TableContainer sx={{ maxWidth: 900, maxHeight: 400 }} component={Paper}>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Action needed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>a</TableCell>
                    <TableCell>a</TableCell>
                    <TableCell>a</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </section>
      </Grid>
    </Grid>
  );
}

export default Results;

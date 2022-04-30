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
import './Reports.css';
import '../global.css';

// Components
import {
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Snackbar,
  Fade,
  Alert,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { format, millisecondsToMinutes } from 'date-fns';

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

function Reports() {
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

  const columns = useMemo(() => [
    {
      Header: 'Report ID',
      id: 1,
    },
    {
      Header: 'Report Date/Time',
      id: 2,
    },
    {
      Header: 'Duration',
      id: 3,
    },
    {
      Header: 'Hosts Scanned',
      id: 4,
    },
    {
      Header: 'Report Link',
      id: 5,
    },
  ]);

  useEffect(() => {
    async function getData() {
      try {
        await axios.get('/report/getReports', { timeout: 20000 }).then((response) => {
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reportData.reports.length) : 0; //eslint-disable-line spaced-comment, max-len

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
          <h1>Report Results</h1>
          <p>Report results can be found below.</p>
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
                {loadingReportData ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {reportError.error ? <p>{reportError.message}</p> : <CircularProgress />}
                      {/* <CircularProgress /> */}
                    </TableCell>
                  </TableRow>
                ) : (
                  // reportData.reports.map((row) => (
                  (rowsPerPage > 0
                    ? reportData.reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse()
                    : reportData.reports.reverse()
                  ).map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row._id}</TableCell>
                      <TableCell>{format(new Date(row.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell>{`${millisecondsToMinutes(row.duration)} minutes`}</TableCell>
                      <TableCell>{row.hosts.length}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" href={`/report/id/?id=${row._id}`}>
                          <AttachFileOutlinedIcon />
                        </IconButton>
                      </TableCell>
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
                    count={reportData.reports ? reportData.reports.length : 0}
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
        </section>

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
    </Grid>
  );
}

export default Reports;

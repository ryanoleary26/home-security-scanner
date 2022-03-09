// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewScan.css';
import '../global.css';

// Components
import Grid from '@mui/material/Grid';

function NewScan() {
  return (
    <Grid container sx={{ paddingBottom: 30 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section>
          <h1>New Scan</h1>

        </section>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} />
    </Grid>
  );
}

export default NewScan;

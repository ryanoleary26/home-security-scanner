// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./Schedules.css";

// Components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Input, FormHelperText } from "@mui/material";

function Schedules() {
  return (
    <>
      <Grid container sx={{ paddingBottom: 30 }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <section>
            <h1>Scan Schedules</h1>
            <p>Create and manage scanning schedules.</p>
          </section>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <section>
            <h2>Create a new schedule</h2>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  defaultValue="Hello World"
                />
                <TextField
                  disabled
                  id="outlined-disabled"
                  label="Disabled"
                  defaultValue="Hello World"
                />
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Read Only"
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="outlined-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="outlined-search"
                  label="Search field"
                  type="search"
                />
                <TextField
                  id="outlined-helperText"
                  label="Helper text"
                  defaultValue="Default Value"
                  helperText="Some important text"
                />
              </div>
              <div>
                <TextField
                  required
                  id="filled-required"
                  label="Required"
                  defaultValue="Hello World"
                  variant="filled"
                />
                <TextField
                  disabled
                  id="filled-disabled"
                  label="Disabled"
                  defaultValue="Hello World"
                  variant="filled"
                />
                <TextField
                  id="filled-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="filled"
                />
                <TextField
                  id="filled-read-only-input"
                  label="Read Only"
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="filled"
                />
                <TextField
                  id="filled-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                />
                <TextField
                  id="filled-search"
                  label="Search field"
                  type="search"
                  variant="filled"
                />
                <TextField
                  id="filled-helperText"
                  label="Helper text"
                  defaultValue="Default Value"
                  helperText="Some important text"
                  variant="filled"
                />
              </div>
              <div>
                <TextField
                  required
                  id="standard-required"
                  label="Required"
                  defaultValue="Hello World"
                  variant="standard"
                />
                <TextField
                  disabled
                  id="standard-disabled"
                  label="Disabled"
                  defaultValue="Hello World"
                  variant="standard"
                />
                <TextField
                  id="standard-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                />
                <TextField
                  id="standard-read-only-input"
                  label="Read Only"
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                />
                <TextField
                  id="standard-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                />
                <TextField
                  id="standard-search"
                  label="Search field"
                  type="search"
                  variant="standard"
                />
                <TextField
                  id="standard-helperText"
                  label="Helper text"
                  defaultValue="Default Value"
                  helperText="Some important text"
                  variant="standard"
                />
              </div>
            </Box>
          </section>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <section>
            <h2>Modify current schedule</h2>
            <FormControl>
              <InputLabel htmlFor="my-input">Email address</InputLabel>
              <Input id="my-input" aria-describedby="my-helper-text" />
              <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
            </FormControl>
          </section>
        </Grid>
      </Grid>
    </>
  );
}

export default Schedules;

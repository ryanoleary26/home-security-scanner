import React from 'react';
import ReactDOM from 'react-dom';

// Pages
import Home from './home/Home';
import Results from './results/Results'
import NewScan from './newscan/NewScan'
import Schedules from './schedules/Schedules'
import ErrorPage from './errorpage/ErrorPage'

// Style
import './index.css';
import './global.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Components
import Header from "./comps/Header/Header";
// import Footer from "./comps/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/newscan" element={<NewScan />} />
          <Route path="/schedules" element={<Schedules />}/>
          <Route path="*" element={<ErrorPage />}/>
        </Routes>
      </Router>
      {/* <Footer/> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

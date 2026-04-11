import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DocPat from './DocPat';
import DocPage1 from './DocPage1';
import PatPage1 from './PatPage1';
import DoctorLogin from "./DoctorLogin";
import DoctorSignup from "./DoctorSignup";
import PatientLogin from "./PatientLogin";
import PatientSignup from "./PatientSignup";
import PredictPage from "./PredictPage";
import React from "react";



function Landing() {
  return (
    <div className="landing">

      {/* 3D particle background */}
      <div className="ripple-container">
        <div className="particle-plane"></div>
      </div>

      {/* 2D layered ripples */}
      <div className="ripple-waves">
        <span className="ripple"></span>
        <span className="ripple"></span>
        <span className="ripple"></span>
        <span className="ripple"></span>
        <span className="ripple"></span>
        <span className="ripple"></span>
      </div>

      <div className="title-wrapper">
        <h1 className="title">respira.</h1>
      </div>

      <Link to="/docpat" style={{ textDecoration: 'none' }}>
        <button className="get-started">Get Started</button>
      </Link>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docpat" element={<DocPat />} />
        <Route path="/doctor1" element={<DocPage1 />} />
        <Route path="/patient1" element={<PatPage1 />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-signup" element={<DoctorSignup />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/predict" element={<PredictPage />} />
 
       
      </Routes>
    </Router>
  );
}

export default App;

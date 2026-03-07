import { useState, useRef } from "react";
import "./DocPage1.css";
import { supabase } from "./supabaseClient";

function DocPage1() {

  const [patients, setPatients] = useState([
    { id: 1, name: "Ram Anok", age: 23, prescriptions: [] },
    { id: 2, name: "Anand Raj", age: 32, prescriptions: [] },
    { id: 3, name: "Rahul Verma", age: 60, prescriptions: [] }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: ""
  });

  const [prescriptionData, setPrescriptionData] = useState({
    medicine: "",
    dosage: "",
    duration: "",
    notes: ""
  });

  const [diagnosis, setDiagnosis] = useState("");

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  /* PATIENT INPUT CHANGE */
  const handlePatientChange = (e) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value
    });
  };

  /* ADD PATIENT */
const savePatient = async () => {

  const { data, error } = await supabase
    .from("patient")
    .insert([
      {
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        contact_number: newPatient.contact,
        email: newPatient.email,
        password: "default123"
      }
    ])
    .select();

  if (error) {
    console.error("Error adding patient:", error);
    return;
  }

  const savedPatient = data[0];

  const patient = {
    id: savedPatient.patient_id,
    name: savedPatient.name,
    age: savedPatient.age,
    prescriptions: []
  };

  setPatients([...patients, patient]);

  setNewPatient({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: ""
  });

  setShowPatientForm(false);
};
  /* PRESCRIPTION INPUT */
  const handlePrescriptionChange = (e) => {
    setPrescriptionData({
      ...prescriptionData,
      [e.target.name]: e.target.value
    });
  };

  /* SAVE PRESCRIPTION */
 const savePrescription = async () => {

  if (!selectedPatient) {
    alert("Please select a patient first");
    return;
  }

  const { data, error } = await supabase
    .from("prescriptions")
    .insert([
      {
        doctor_id: "9ca6a126-44a2-4a33-b2d5-c8c13ea0e98e",
        patient_id: "14235d76-4d0b-445d-8bef-7c1d673914e4",
        diagnosis: diagnosis,
        medicine: prescriptionData.medicine,
        dosage: prescriptionData.dosage,
        duration: prescriptionData.duration,
        notes: prescriptionData.notes
      }
    ])
    .select();

  if (error) {
    console.error("Error saving prescription:", error);
    alert("Failed to save prescription");
    return;
  }

  console.log("Prescription saved:", data);

  setPrescriptionData({
    medicine: "",
    dosage: "",
    duration: "",
    notes: ""
  });

  setDiagnosis("");

  setShowPrescriptionForm(false);
};
  return (
    <div className="doctor-dashboard">

      {/* SIDEBAR */}
      <div className="patient-list">

        <h1 className="brand-title">respira.</h1>
        <p className="list-header">Active Patients</p>

        <button
          className="add-patient-btn"
          onClick={() => setShowPatientForm(true)}
        >
          + Add Patient
        </button>

        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`patient-card ${selectedPatient?.id === patient.id ? "active" : ""}`}
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="patient-info">
              <strong>{patient.name}</strong>
              <span>Age {patient.age}</span>
            </div>

            {selectedPatient?.id === patient.id && (
              <span style={{ color: "var(--cyan-light)" }}>●</span>
            )}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="patient-details">

        {selectedPatient ? (
          <>
            <div className="header-row">
              <div className="patient-title">

                <h2>{selectedPatient.name}</h2>
                <span className="status-badge">Stable</span>

                <button
                  className="prescription-btn"
                  onClick={() => setShowPrescriptionForm(true)}
                >
                  + Prescription
                </button>

              </div>
            </div>

            <div className="dashboard-grid">

              {/* MEDICAL HISTORY */}
              <div className="glass-panel history-panel">
                <h3>📜 Medical History</h3>

                <ul className="history-list">
                  <li>Asthma <span>Oct 2021</span></li>
                  <li>Bronchitis <span>June 2023</span></li>
                  <li>COPD <span>Jan 2026</span></li>
                </ul>
              </div>

              {/* AUDIO */}
              <div className="glass-panel audio-panel">

                <h3>🔊 Sound Analysis</h3>

                <div className="visualizer-container">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>

                <button
                  className="primary-btn"
                  onClick={handleUploadClick}
                >
                  Drop Audio
                </button>

                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

              </div>

            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🩺</div>
            <p>Select a patient from the sidebar</p>
          </div>
        )}
      </div>


      {/* ADD PATIENT POPUP */}
      {showPatientForm && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h3>Add Patient</h3>

            <input
              name="name"
              placeholder="Patient Name"
              value={newPatient.name}
              onChange={handlePatientChange}
            />

            <input
              name="age"
              placeholder="Age"
              value={newPatient.age}
              onChange={handlePatientChange}
            />

            <select
              name="gender"
              value={newPatient.gender}
              onChange={handlePatientChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              name="contact"
              placeholder="Contact Number"
              value={newPatient.contact}
              onChange={handlePatientChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={newPatient.email}
              onChange={handlePatientChange}
            />

            <div className="modal-buttons">

              <button onClick={savePatient}>Save</button>

              <button onClick={() => setShowPatientForm(false)}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}


      {/* ADD PRESCRIPTION POPUP */}
      {showPrescriptionForm && (

        <div className="modal-overlay">

          <div className="modal-box">

            <h3>Add Prescription</h3>

            <input
              type="text"
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />

            <input
              name="medicine"
              placeholder="Medicine Name"
              value={prescriptionData.medicine}
              onChange={handlePrescriptionChange}
            />

            <input
              name="dosage"
              placeholder="Dosage"
              value={prescriptionData.dosage}
              onChange={handlePrescriptionChange}
            />

            <input
              name="duration"
              placeholder="Duration"
              value={prescriptionData.duration}
              onChange={handlePrescriptionChange}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={prescriptionData.notes}
              onChange={handlePrescriptionChange}
            />

            <div className="modal-buttons">

              <button onClick={savePrescription}>Save</button>

              <button onClick={() => setShowPrescriptionForm(false)}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default DocPage1;
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DocPage1.css";
import { supabase } from "./supabaseClient";

function DocPage1() {
  const navigate = useNavigate();
 
  const doctorId = localStorage.getItem("doctor_id");
  const doctorName = localStorage.getItem("doctor_name");

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

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

  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log("Selected file:", file);

  // Optional: directly navigate with file
  navigate("/predict", {
    state: {
      patient: selectedPatient,
      file: file
    }
  });
};

  const [diagnosis, setDiagnosis] = useState("");


  // Check if doctor is logged in
  useEffect(() => {
    if (!doctorId) {
      navigate("/doctor-login");
      return;
    }
    fetchPatients();
  }, []);

  // Fetch all patients for this doctor
  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from("patient")
      .select("*")
      .eq("doctor_id", doctorId);

    if (error) {
      console.error("Error fetching patients:", error);
      return;
    }

    const formattedPatients = data.map((p) => ({
      id: p.patient_id,
      name: p.name,
      age: p.age
    }));

    setPatients(formattedPatients);
  };

  // Fetch prescriptions for selected patient
  const fetchPrescriptions = async (patientId) => {
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching prescriptions:", error);
      return;
    }

    setPrescriptions(data);
  };


  // Patient form handling
  const handlePatientChange = (e) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value
    });
  };

  const savePatient = async () => {
    const { error } = await supabase
      .from("patient")
      .insert([{
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        contact_number: newPatient.contact,
        email: newPatient.email,
        password: "default123",
        doctor_id: doctorId
      }]);

    if (error) {
      console.error("Error adding patient:", error);
      return;
    }

    setNewPatient({ name: "", age: "", gender: "", contact: "", email: "" });
    setShowPatientForm(false);
    fetchPatients();
  };

  // Prescription form handling
  const handlePrescriptionChange = (e) => {
    setPrescriptionData({
      ...prescriptionData,
      [e.target.name]: e.target.value
    });
  };

  const savePrescription = async () => {
    if (!selectedPatient) {
      alert("Select a patient first");
      return;
    }

    const { error } = await supabase
      .from("prescriptions")
      .insert([{
        doctor_id: doctorId,
        patient_id: selectedPatient.id,
        diagnosis: diagnosis,
        medicine: prescriptionData.medicine,
        dosage: prescriptionData.dosage,
        duration: prescriptionData.duration,
        notes: prescriptionData.notes
      }]);

    if (error) {
      console.error("Error saving prescription:", error);
      return;
    }

    setPrescriptionData({ medicine: "", dosage: "", duration: "", notes: "" });
    setDiagnosis("");
    setShowPrescriptionForm(false);
    fetchPrescriptions(selectedPatient.id);
  };

  

  return (
    <div className="doctor-dashboard">

      {/* SIDEBAR */}
      <div className="patient-list">

  <div className="welcome-container">
    <h2 className="welcome-doctor">Dr. {doctorName}</h2>
  </div>

  <p className="list-header">Active Patients</p>

  {/* ✅ PATIENT LIST FIRST */}
  <div className="patients-container">
    {patients.map((patient) => (
      <div
        key={patient.id}
        className={`patient-card ${
          selectedPatient?.id === patient.id ? "active" : ""
        }`}
        onClick={() => {
          setSelectedPatient(patient);
          fetchPrescriptions(patient.id);
        }}
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

  {/* ✅ BUTTON AT THE END */}
  <button
    className="add-patient-btn"
    onClick={() => setShowPatientForm(true)}
  >
    + Add Patient
  </button>

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

              <div className="glass-panel history-panel">
                <h3>📜 Medical History</h3>
                <ul className="history-list">
                  <li>Asthma <span>Oct 2021</span></li>
                  <li>Bronchitis <span>June 2023</span></li>
                  <li>COPD <span>Jan 2026</span></li>
                </ul>
              </div>

              <div className="glass-panel audio-panel">
                <h3>🔊 Sound Analysis</h3>
                <div className="visualizer-container">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                    <button
  className="primary-btn"
  onClick={() =>
    navigate("/predict", {
      state: { patient: selectedPatient }
    })
  }
>
  Upload Audio
</button>
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div className="glass-panel prescription-panel">
              <h3>🩺 Patient Medication Log</h3>
              {prescriptions.length === 0 ? (
                <p>No medications recorded yet</p>
              ) : (
                <ul className="history-list">
                  {prescriptions.map((p) => (
                    <li key={p.prescription_id}>
                      <strong>{p.diagnosis}</strong><br />
                      Medicine: {p.medicine}<br />
                      Dosage: {p.dosage}<br />
                      Duration: {p.duration}
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
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

      {/* ADD PATIENT MODAL */}
      {showPatientForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Patient</h3>
            <input name="name" placeholder="Patient Name" value={newPatient.name} onChange={handlePatientChange} />
            <input name="age" placeholder="Age" value={newPatient.age} onChange={handlePatientChange} />
            <select name="gender" value={newPatient.gender} onChange={handlePatientChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input name="contact" placeholder="Contact Number" value={newPatient.contact} onChange={handlePatientChange} />
            <input name="email" placeholder="Email" value={newPatient.email} onChange={handlePatientChange} />
            <div className="modal-buttons">
              <button onClick={savePatient}>Save</button>
              <button onClick={() => setShowPatientForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRESCRIPTION MODAL */}
      {showPrescriptionForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Prescription</h3>
            <input placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            <input name="medicine" placeholder="Medicine" value={prescriptionData.medicine} onChange={handlePrescriptionChange} />
            <input name="dosage" placeholder="Dosage" value={prescriptionData.dosage} onChange={handlePrescriptionChange} />
            <input name="duration" placeholder="Duration" value={prescriptionData.duration} onChange={handlePrescriptionChange} />
            <textarea name="notes" placeholder="Notes" value={prescriptionData.notes} onChange={handlePrescriptionChange} />
            <div className="modal-buttons">
              <button onClick={savePrescription}>Save</button>
              <button onClick={() => setShowPrescriptionForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DocPage1;
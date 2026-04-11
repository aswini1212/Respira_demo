import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./PatPage1.css";

function PatPage1() {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("patient");
    navigate("/patient-login");
  };

  useEffect(() => {
    const storedPatient = JSON.parse(localStorage.getItem("patient"));
    if (storedPatient) {
      setPatient(storedPatient);
      fetchHistory(storedPatient.patient_id);
      fetchPrescriptions(storedPatient.patient_id);
    } else {
      navigate("/patient-login");
    }
  }, []);

  const fetchHistory = async (patientId) => {
    const { data } = await supabase
      .from("disease_history")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    setHistory(data || []);
    if (data?.length > 0) setSelected(data[0]);
  };

  const fetchPrescriptions = async (patientId) => {
    const { data } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    setPrescriptions(data || []);
  };

  const handleUploadClick = () => {
  navigate("/predict", {
    state: { patient }
  });
};
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) console.log("Uploaded:", file.name);
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="patient-dashboard">

      {/* SIDEBAR */}
      <div className="history-sidebar">

      

        {/* ✅ Patient Info */}
        <div className="patient-info-box">
          <h2>{patient.name}</h2>
          <p>Age: {patient.age}</p>
        </div>

        <p className="sidebar-title">Diagnosis History</p>

        {history.map((item) => (
          <div
            key={item.id}
            className={`history-item ${selected?.id === item.id ? "active" : ""}`}
            onClick={() => setSelected(item)}
          >
            <strong>{item.disease}</strong>
            <span>{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="history-details">

        {/* AUDIO PANEL */}
        <div className="glass-panel">
          <h3>🔊 Check Lung Sound</h3>

          <button className="glass-btn" onClick={handleUploadClick}>
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

        {/* DIAGNOSIS */}
        {selected && (
          <div className="glass-panel">
            <h3>🩺 Diagnosis</h3>
            <p className="diagnosis">{selected.disease}</p>
            <p>{selected.notes}</p>
          </div>
        )}

        {/* PRESCRIPTIONS */}
        <div className="glass-panel">
          <h3>💊 Doctor Prescriptions</h3>

          {prescriptions.length === 0 ? (
            <p>No prescriptions yet</p>
          ) : (
            <ul className="prescription-list">
              {prescriptions.map((p) => (
                <li key={p.prescription_id}>
                  <strong>{p.diagnosis}</strong><br />
                  Medicine: {p.medicine} <br />
                  Dosage: {p.dosage} <br />
                  Duration: {p.duration} <br />
                  Notes: {p.notes} <br />
                  <span>
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default PatPage1;
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./PatPage1.css";

function PatPage1() {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  const navigate = useNavigate(); // ✅ Initialize navigate here

  /* Logout Function */
  const handleLogout = () => {
    localStorage.removeItem("patient");
    navigate("/patient-login"); // redirect to login
  };

  /* Load logged in patient */
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

  /* Fetch diagnosis history */
  const fetchHistory = async (patientId) => {
    const { data, error } = await supabase
      .from("disease_history")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setHistory(data);
    if (data.length > 0) setSelected(data[0]);
  };

  /* Fetch prescriptions added by doctor */
  const fetchPrescriptions = async (patientId) => {
    const { data, error } = await supabase
      .from("prescriptions") // ✅ Corrected table name
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setPrescriptions(data);
  };

  /* Download report */
  const downloadReport = () => {
    if (!selected) return;

    const doctorMeds = prescriptions
      .map((p) => `• ${p.medicine} - ${p.dosage}`)
      .join("\n");

    const report = `
Respira Diagnosis Report

Patient: ${patient.name}
Age: ${patient.age}

Diagnosis: ${selected.disease}

Notes:
${selected.notes}

AI Suggested Remedies:
${selected.remedies?.join("\n")}

Doctor Prescription:
${doctorMeds}
`;

    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "respira_report.txt";
    link.click();
  };

  if (!patient) {
    return <div style={{ padding: "40px" }}>Loading dashboard...</div>;
  }

  return (
    <div className="patient-dashboard">
      {/* LEFT SIDEBAR */}
      <div className="history-sidebar">
        {/* Logout button */}
        <button
          className="logout-btn-circle"
          onClick={handleLogout}
          title="Log out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>

        <h1 className="brand-title">respira.</h1>

        <p className="sidebar-title">Diagnosis History</p>

        {history.length === 0 && <p style={{ color: "#94a3b8" }}>No records yet</p>}

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
        <div className="details-content">
          {/* Patient Summary */}
          <div className="patient-summary glass-panel">
            <h2>{patient.name}</h2>
            <span>Age: {patient.age}</span>
          </div>

          {/* Diagnosis */}
          {selected && (
            <div className="glass-panel">
              <h3>🩺 Diagnosis</h3>
              <p className="diagnosis">{selected.disease}</p>
              <p className="doctor-notes">{selected.notes}</p>
            </div>
          )}

          {/* Remedies */}
          {selected && (
            <div className="glass-panel">
              <h3>💊 Suggested Remedies</h3>
              <ul className="remedy-list">
                {selected.remedies?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Doctor Prescription */}
          {prescriptions.length > 0 && (
            <div className="glass-panel">
              <h3>👨‍⚕️ Doctor Prescription</h3>
              <ul className="remedy-list">
                {prescriptions.map((p) => (
                  <li key={p.id}>
                    {p.medicine} - {p.dosage}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Download Report */}
        {selected && (
          <div className="download-section">
            <button
              className="primary-btn download-btn"
              onClick={downloadReport}
            >
              Download Report 📄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatPage1;
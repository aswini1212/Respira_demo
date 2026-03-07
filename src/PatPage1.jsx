import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./PatPage1.css";

function PatPage1() {

  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);

  /* Load logged in patient */

  useEffect(() => {

    const storedPatient = JSON.parse(localStorage.getItem("patient"));

    if (storedPatient) {
      setPatient(storedPatient);
      fetchHistory(storedPatient.patient_id);
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

    if (data.length > 0) {
      setSelected(data[0]);
    }
  };


  /* Download report */

  const downloadReport = () => {

    if (!selected) return;

    const report = `
Respira Diagnosis Report

Patient: ${patient.name}
Age: ${patient.age}

Diagnosis: ${selected.disease}

Notes:
${selected.notes}

Remedies:
${selected.remedies?.join("\n")}
`;

    const blob = new Blob([report], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "respira_report.txt";

    link.click();
  };


  if (!patient) {
    return <div style={{padding:"40px"}}>Loading dashboard...</div>;
  }

  return (

    <div className="patient-dashboard">

      {/* LEFT SIDEBAR : DIAGNOSIS HISTORY */}

      <div className="history-sidebar">

        <h1 className="brand-title">respira.</h1>

        <p className="sidebar-title">Diagnosis History</p>

        {history.length === 0 && (
          <p style={{color:"#94a3b8"}}>No records yet</p>
        )}

        {history.map((item) => (

          <div
            key={item.id}
            className={`history-item ${
              selected?.id === item.id ? "active" : ""
            }`}
            onClick={() => setSelected(item)}
          >

            <strong>{item.disease}</strong>

            <span>
              {new Date(item.created_at).toLocaleDateString()}
            </span>

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

                {selected.remedies?.map((r,i)=>(
                  <li key={i}>{r}</li>
                ))}

              </ul>

            </div>

          )}

        </div>


        {/* Download */}

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
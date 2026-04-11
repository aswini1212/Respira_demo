import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./PredictPage.css";

function PredictPage() {
  const location = useLocation();
  const patient = location.state?.patient;

  const [result, setResult] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/predict", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="predict-page">
      
      

      <div className="predict-card">
       

        {patient && (
          <p className="patient-name">
            Patient: <span>{patient.name}</span>
          </p>
        )}

        <label className="upload-box">
          <input type="file" onChange={handleFileChange} hidden />
          Upload Lung Sound
        </label>

        {result && (
          <div className="result-box">
            <h2>{result.prediction}</h2>
            <p>Confidence: {result.confidence}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictPage;
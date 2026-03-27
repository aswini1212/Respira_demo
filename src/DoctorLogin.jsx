import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./DoctorLogin.css";

function DoctorLogin() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async () => {

    const { data, error } = await supabase
      .from("doctor")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if(error || !data){
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("doctor_id", data.doctor_id);
    localStorage.setItem("doctor_name", data.name);

    navigate("/doctor1");
  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h2>Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Sign In
        </button>

        <p>
          Don't have an account?
          <span onClick={()=>navigate("/doctor-signup")}>
            Sign Up
          </span>
        </p>

      </div>

    </div>

  );
}

export default DoctorLogin;
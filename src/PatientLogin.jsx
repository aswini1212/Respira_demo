import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./PatientLogin.css";

function PatientLogin(){

 const navigate = useNavigate();

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const handleLogin = async () => {

  const { data, error } = await supabase
   .from("patient")
   .select("*")
   .eq("email", email)
   .eq("password", password)
   .single();

  if(error){
    alert("Invalid login");
    return;
  }

  localStorage.setItem("patient", JSON.stringify(data));

  navigate("/patient1");

 };

 return (

  <div className="login-container">

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
    <span onClick={()=>navigate("/patient-signup")}>
      Sign Up
    </span>
   </p>

  </div>

 );
}

export default PatientLogin;
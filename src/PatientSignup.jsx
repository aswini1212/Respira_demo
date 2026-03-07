import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./PatientSignup.css";

function PatientSignup() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [contact,setContact] = useState("");
  const [password,setPassword] = useState("");
  const [age, setAge] = useState("");

  const handleSignup = async () => {

    const { error } = await supabase
      .from("patient")
      .insert([
        {
          name:name,
          age: age,
          email:email,
          contact_number:contact,
          password:password
        }
      ]);

    if(error){
      alert("Signup failed");
      return;
    }

    alert("Account created");

    navigate("/patient-login");
  };

  return (

    <div className="signup-wrapper">

      <div className="signup-card">

        <h2>Create Patient Account</h2>

        <input
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
        />
        
        <input
           type="number"
           placeholder="Age"
           onChange={(e)=>setAge(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          placeholder="Contact Number"
          onChange={(e)=>setContact(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>
          Sign Up
        </button>

        <p>
          Already have an account?
          <span onClick={()=>navigate("/patient-login")}>
            Login
          </span>
        </p>

      </div>

    </div>

  );
}

export default PatientSignup;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./DoctorSignup.css";

function DoctorSignup(){

const navigate = useNavigate();

const [form,setForm] = useState({
name:"",
email:"",
contact_number:"",
password:""
});

const handleChange = (e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};

const handleSignup = async()=>{

const { error } = await supabase
.from("doctor")
.insert([form]);

if(error){

alert("Signup failed");
return;

}

alert("Signup successful! Please login");

navigate("/doctor-login");

};

return(

<div className="auth-page">

<div className="auth-card">

<h2>Create an Account</h2>

<input
name="name"
placeholder="Name"
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
/>

<input
name="contact_number"
placeholder="Contact Number"
onChange={handleChange}
/>

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>

<button onClick={handleSignup}>
Sign Up
</button>

<p>
Already have an account?
<span onClick={()=>navigate("/doctor-login")}>
Login
</span>
</p>

</div>

</div>

);

}

export default DoctorSignup;
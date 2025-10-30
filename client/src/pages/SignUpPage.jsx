import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import MessageBox from "../components/MessageBox";
import { signupUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const handleSignup = async (data) => {
    try {
      const res = await signupUser(data);
      setMessage(res.data.message);
      setMsgType("success");

      if (res.data.message.toLowerCase().includes("success")) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      setMsgType("error");
    }
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Full Name", label: "Full Name" },
    { name: "email", type: "email", placeholder: "Email Address", label: "Email" },
    { name: "password", type: "password", placeholder: "Password", label: "Password" },
    {
      name: "role",
      type: "select",
      placeholder: "Select Role",
      label: "Role",
      options: [
        { label: "Student", value: "student" },
        { label: "Admin", value: "admin" },
        { label: "Company", value: "company" },
      ],
    },
    { 
      name: "resume_link", 
      type: "text", 
      placeholder: "Resume Link (optional)", 
      label: "Resume Link",
      required: false 
    },
  ];

  return (
    <>
      {message && <MessageBox message={message} type={msgType} />}
      <AuthForm
        fields={fields}
        onSubmit={handleSignup}
        buttonText="Sign Up"
        title="Create Account"
        subtitle="Sign-up to continue in Velai-Vaaippu"
        footerContent={
          <p>
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </p>
        }
      />
    </>
  );
};

export default Signup;

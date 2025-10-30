import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import MessageBox from "../components/MessageBox";
import { loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

 const handleLogin = async (data) => {
  try {
    const res = await loginUser(data);
    localStorage.setItem("authToken", res.data.token); // store token
    setMessage(res.data.message);
    setMsgType("success");
    if (res.data.message.toLowerCase().includes("successful")) {
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  } catch (error) {
    setMessage("Invalid email or password.");
    setMsgType("error");
  }
};


  const fields = [
    { name: "email", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
  ];

  return (
      <>
      {message && <MessageBox message={message} type={msgType} />}
      <AuthForm
        fields={fields}
        onSubmit={handleLogin}
        buttonText="Login"
        title="Login"
        subtitle="Login to continue to velai-vaaippu"
        footerContent={
          <p>
            Don't have a account?{" "}
            <Link to="/signup">Signup here</Link>
          </p>
        }
      />
    </>
  );
};

export default Login;

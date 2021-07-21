import React, { useState } from "react";

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState(0); // 0 - Sign-In page   1 - Sign-Up page
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleLoginMode = () => {
    loginMode ? setLoginMode(0) : setLoginMode(1);
  };

  return (
    <div className="login-box">
      <h1 className="login-heading">Project IAS</h1>
      <div className="login-toggle">
        <div className="login-toggle-text">Not registered yet?</div>
        <div className="login-toggle-link" onClick={toggleLoginMode}>
          {loginMode ? "Sign In" : "Sign Up"}
        </div>
      </div>
      <div className="input-contain">
        <input
          className="login-input"
          type="email"
          id="femail"
          name="femail"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <label class="placeholder-label" for="femail" id="placeholder-femail">
          <div class="placeholder-text">Email address</div>
        </label>
      </div>
      <div className="input-contain">
        <input
          className="login-input"
          type="password"
          id="fpass"
          name="fpass"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <label class="placeholder-label" for="fpass" id="placeholder-fpass">
          <div class="placeholder-text">Password</div>
        </label>
      </div>
      <div className="input-contain">
        <button className="login-submit" type="submit">
          {loginMode ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

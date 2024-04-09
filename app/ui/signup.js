"use client"

import React, { useState } from 'react';
import { signUp, checkUserNameUnique } from '../actions/signUp';



  const SignupComponent = () => {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countryCode, setCountryCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic pattern check for userName
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,}$/.test(userName)) {
      setError("UserName must contain both letters and numbers.");
      return;
    }

    // Check if the userName is unique
    const isUnique = await checkUserNameUnique(userName); // Updated function call
    if (!isUnique) {
      setError("UserName already exists.");
      return;
    }

    const response = await signUp(name, email, password, `${countryCode}${phoneNumber}`, userName); // Updated parameter
    if (response && response.user) {
      console.log('Signup successful! Verification email sent.');
      setSignupSuccess(true);
      setError("Please check your email to verify your account.");
    } else {
      console.error('Signup error:', response.error);
      setError(response.error);
      setSignupSuccess(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="UserName"
          required
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
            style={{ paddingRight: '30px' }} // Make space for the icon
          />
          <span
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🚫' : '👁️'}
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm Password" 
            required 
            style={{ paddingRight: '30px' }} // Make space for the icon
          />
          <span
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '🚫' : '👁️'}
          </span>
        </div>
        
        <div>
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Phone Number" 
            required 
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {signupSuccess && <p>Signup successful!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default SignupComponent;

/*import React, { useState } from 'react';
import { signUp } from '../actions/signUp';

const SignupComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  
  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    const response = await signUp(name, email, password);
    if (response.user) {
      console.log('Signup successful!', response.user);
      setSignupSuccess(true);
    } else {
      console.error('Signup error:', response.error);
      setError(response.error);
      setSignupSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
          style={styles.input} 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          style={styles.input} 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
          style={styles.input} 
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {signupSuccess && <p style={styles.successMessage}>Signup successful!</p>}
      {error && <p style={styles.errorMessage}>Error: {error}</p>}
    </div>
  );
};
const styles = {
  container: {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: '#f8f9fa', 
    borderColor: '#ced4da', 
    border: '1px solid', 
    color: '#495057'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonHover: { 
    backgroundColor: '#0056b3',
  },
  errorMessage: {
    color: '#ff0000',
  }
};

export default SignupComponent;
*/
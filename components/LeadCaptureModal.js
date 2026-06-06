'use client';
import { useState, useEffect } from 'react';

export default function LeadCaptureModal({ proName, proId, acceptingLeads = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success
  
  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [task, setTask] = useState('');

  // Authentication Flow States
  const [view, setView] = useState('form'); // form, email, login_otp, register_otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSimulatedOtp, setIsSimulatedOtp] = useState(false);
  const [fetchedCustomer, setFetchedCustomer] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const storedName = localStorage.getItem('customer_name');
      const storedPhone = localStorage.getItem('customer_phone');
      const storedEmail = localStorage.getItem('customer_email');
      
      if (storedName) setName(storedName);
      if (storedPhone) setPhone(storedPhone);
      if (storedEmail) setEmail(storedEmail);
      
      resetAuth();
    }
  }, [isOpen]);

  const resetAuth = () => {
    setView('form');
    setOtp('');
    setGeneratedOtp('');
    setIsSimulatedOtp(false);
    setAuthError('');
    setAuthLoading(false);
    setFetchedCustomer(null);
  };

  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, '');
    setPhone(digits.slice(0, 10)); // Max 10 digits
  };

  const formatPhoneNumber = (num) => {
    if (num.length <= 5) return num;
    return `${num.slice(0, 5)} ${num.slice(5)}`;
  };

  // Submit Lead Helper
  const submitLead = async (finalName, finalPhone, finalTask) => {
    setStatus('loading');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId,
          name: finalName,
          phone: finalPhone,
          task: finalTask,
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          resetAuth();
        }, 3000);
      } else {
        setStatus('idle');
        alert('Failed to send request. Please try again.');
      }
    } catch (err) {
      setStatus('idle');
      alert('Network error.');
    }
  };

  // Step 1: Handle Contact Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Validations
    if (!name.trim()) {
      setAuthError('Name is required.');
      return;
    }
    if (name.trim().length > 16) {
      setAuthError('Name cannot exceed 16 characters.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanPhone)) {
      setAuthError('Please enter a valid 10-digit Indian mobile number (should start with 6, 7, 8, or 9).');
      return;
    }

    if (!task.trim()) {
      setAuthError('Task description is required.');
      return;
    }

    // Check if logged in
    const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('customer_phone');
    if (isLoggedIn) {
      // Proceed directly to submit lead
      await submitLead(name.trim(), cleanPhone, task.trim());
    } else {
      // Take to authentication entry step
      setView('email');
    }
  };

  // Step 2: Handle Email Verification Entry
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setAuthLoading(true);

    try {
      // Check if email exists
      const checkRes = await fetch(`/api/customer/check?email=${encodeURIComponent(cleanEmail)}`);
      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        setAuthError('Failed to verify email. Please try again.');
        setAuthLoading(false);
        return;
      }

      if (checkData.registered) {
        // Save existing user info for later local storage persistence
        setFetchedCustomer(checkData.customer);

        // Call backend OTP API to send OTP to registered email
        const otpRes = await fetch('/api/customer/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send', email: cleanEmail })
        });
        const otpData = await otpRes.json();

        if (!otpRes.ok) {
          setAuthError(otpData.error || 'Failed to dispatch verification code. Please try again.');
          setAuthLoading(false);
          return;
        }

        setGeneratedOtp(otpData.otp || '');
        setIsSimulatedOtp(otpData.simulated);
        setAuthLoading(false);
        setView('login_otp');
      } else {
        // Email is not registered. Need to create an account.
        // First check if the Phone Number is already registered to another account
        const cleanPhone = phone.trim().replace(/\D/g, '');
        const checkPhoneRes = await fetch(`/api/customer/check?phone=${cleanPhone}`);
        const checkPhoneData = await checkPhoneRes.json();

        if (checkPhoneRes.ok && checkPhoneData.registered) {
          setAuthError('This mobile number is already registered under a different account. Please go back or log in with your registered email.');
          setAuthLoading(false);
          return;
        }

        // Phone is safe to register, let's send backend OTP to their email for verification!
        const otpRes = await fetch('/api/customer/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send', email: cleanEmail })
        });
        const otpData = await otpRes.json();

        if (!otpRes.ok) {
          setAuthError(otpData.error || 'Failed to dispatch verification code. Please try again.');
          setAuthLoading(false);
          return;
        }

        setGeneratedOtp(otpData.otp || '');
        setIsSimulatedOtp(otpData.simulated);
        setAuthLoading(false);
        setView('register_otp');
      }
    } catch (err) {
      console.error("Email authentication verification failed:", err);
      setAuthError('Connection error. Please try again.');
      setAuthLoading(false);
    }
  };

  // Step 3: Handle OTP Verification & Authentication Finalization
  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const cleanEmail = email.trim().toLowerCase();

      // Call backend to verify OTP securely
      const verifyRes = await fetch('/api/customer/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email: cleanEmail,
          otp: otp.trim()
        })
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setAuthError(verifyData.error || 'Invalid OTP code. Please verify the code sent to your email.');
        setAuthLoading(false);
        return;
      }

      if (view === 'login_otp') {
        // Log in: save existing fetched customer info
        if (typeof window !== 'undefined' && fetchedCustomer) {
          localStorage.setItem('customer_phone', fetchedCustomer.phone);
          localStorage.setItem('customer_name', fetchedCustomer.name);
          localStorage.setItem('customer_email', fetchedCustomer.email);
          window.dispatchEvent(new Event('customer-login-changed'));
        }

        // Submit the lead
        await submitLead(name.trim(), cleanPhone, task.trim());
      } else {
        // view === 'register_otp'
        // Create customer account
        const regRes = await fetch('/api/customer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: cleanPhone,
            email: cleanEmail
          })
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
          setAuthError(regData.error || 'Registration failed. Please try again.');
          setAuthLoading(false);
          return;
        }

        // Log in: save new customer info
        if (typeof window !== 'undefined') {
          localStorage.setItem('customer_phone', regData.customer.phone);
          localStorage.setItem('customer_name', regData.customer.name);
          localStorage.setItem('customer_email', regData.customer.email);
          window.dispatchEvent(new Event('customer-login-changed'));
        }

        // Submit the lead
        await submitLead(name.trim(), cleanPhone, task.trim());
      }
    } catch (err) {
      console.error("OTP verification step error:", err);
      setAuthError('Authentication or lead submission failed. Please try again.');
      setAuthLoading(false);
    }
  };

  return (
    <>
      {!acceptingLeads ? (
        <button 
          disabled
          className="btn btn-secondary" 
          style={{ width: "100%", padding: "0.85rem", cursor: "not-allowed", opacity: 0.6 }}
        >
          Not Accepting Bookings
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary" 
          style={{ width: "100%", padding: "0.85rem" }}
        >
          Request Quote
        </button>
      )}

      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem"
        }}>
          <div className="glass animate-fade-in" style={{
            width: "100%", maxWidth: "450px", padding: "2rem", position: "relative",
            background: "var(--background)", borderRadius: "16px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <button 
              onClick={() => { setIsOpen(false); resetAuth(); }}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}
            >
              &times;
            </button>
            
            {status === 'success' ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "#34d399" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
                <h3>Request Sent Successfully!</h3>
                <p style={{ opacity: 0.8, marginTop: "0.5rem" }}>{proName} will get back to you shortly.</p>
              </div>
            ) : status === 'loading' ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: "0 auto 1.5rem" }} />
                <h3>Sending Request...</h3>
                <p style={{ opacity: 0.6, fontSize: "0.9rem", marginTop: "0.5rem" }}>Please wait while we secure your booking.</p>
              </div>
            ) : (
              <>
                {/* 1. INITIAL FORM SCREEN */}
                {view === 'form' && (
                  <>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Contact {proName}</h2>
                    <p style={{ opacity: 0.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                      Fill out this short form and we'll route your request to {proName} securely.
                    </p>

                    {authError && (
                      <div style={{
                        background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171",
                        padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "1.5rem"
                      }}>
                        ⚠️ {authError}
                      </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Your Name</label>
                          <span style={{ fontSize: "0.75rem", opacity: name.length > 16 ? 1 : 0.6, color: name.length > 16 ? "#f87171" : "inherit" }}>
                            {name.length}/16 chars
                          </span>
                        </div>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          maxLength={16}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          style={{
                            padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                          }} 
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Your Phone Number</label>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <span style={{ position: "absolute", left: "0.75rem", opacity: 0.7, fontSize: "0.95rem", fontWeight: 600 }}>+91</span>
                          <input 
                            type="tel" 
                            name="phone" 
                            required 
                            maxLength={10}
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            style={{
                              padding: "0.75rem 0.75rem 0.75rem 2.6rem", width: "100%", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", letterSpacing: "0.5px"
                            }} 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Task Description</label>
                        <textarea 
                          name="task" 
                          required 
                          rows="3" 
                          placeholder="What do you need help with?" 
                          value={task}
                          onChange={(e) => setTask(e.target.value)}
                          style={{
                            padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", resize: "vertical"
                          }}
                        />
                      </div>
                      
                      <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                        Send Request
                      </button>
                    </form>
                  </>
                )}

                {/* 2. EMAIL VERIFICATION / CHECK SCREEN */}
                {view === 'email' && (
                  <>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Verify Your Account</h2>
                    <p style={{ opacity: 0.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                      Please enter your email to complete your booking securely.
                    </p>

                    {authError && (
                      <div style={{
                        background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171",
                        padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "1.5rem"
                      }}>
                        ⚠️ {authError}
                      </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit}>
                      <div className="flex flex-col gap-1">
                        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Email Address</label>
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          placeholder="e.g. name@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{
                            padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                          }} 
                        />
                      </div>

                      <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                        {authLoading ? 'Verifying...' : 'Continue'}
                      </button>

                      <button type="button" onClick={() => setView('form')} className="btn btn-secondary" style={{ width: "100%" }}>
                        Back to Details
                      </button>
                    </form>
                  </>
                )}

                {/* 3. SIMULATED LOGIN / REGISTER OTP VERIFICATION */}
                {(view === 'login_otp' || view === 'register_otp') && (
                  <>
                    {/* Simulated / Real Gateway Banner */}
                    <div className="glass animate-fade-in" style={{
                      padding: "1.25rem",
                      borderLeft: "4px solid var(--accent)",
                      background: isSimulatedOtp ? "rgba(245, 158, 11, 0.12)" : "rgba(16, 185, 129, 0.12)",
                      borderRadius: "12px",
                      marginBottom: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      boxShadow: isSimulatedOtp ? "0 12px 40px rgba(245, 158, 11, 0.15)" : "0 12px 40px rgba(16, 185, 129, 0.15)",
                      border: isSimulatedOtp ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)",
                      borderLeftWidth: "4px",
                      borderLeftColor: isSimulatedOtp ? "var(--accent)" : "#10b981"
                    }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "1.25rem" }}>✉️</span>
                        <span style={{ 
                          fontSize: "0.8rem", 
                          opacity: 0.95, 
                          color: isSimulatedOtp ? "var(--accent)" : "#10b981", 
                          fontWeight: 700, 
                          letterSpacing: "0.06em" 
                        }}>
                          {isSimulatedOtp ? 'SIMULATED EMAIL GATEWAY' : 'OTP sent to your entered emailID'}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "white" }}>
                        <div>To: <strong>{email.trim()}</strong></div>
                        {isSimulatedOtp ? (
                          <div style={{ marginTop: "0.35rem", fontSize: "0.95rem" }}>
                            Your OTP to verify on Carpenterwala is <strong style={{ color: "var(--accent)", fontSize: "1.1rem", letterSpacing: "1px" }}>{generatedOtp}</strong>
                          </div>
                        ) : (
                          <div style={{ marginTop: "0.35rem", fontSize: "0.9rem", opacity: 0.9 }}>
                            A secure 6-digit OTP code has been successfully dispatched to your email address. Please check your inbox (and spam folder) to complete your verification.
                          </div>
                        )}
                      </div>
                    </div>

                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      {view === 'login_otp' ? 'Verify Log In' : 'Create Your Account'}
                    </h2>
                    <p style={{ opacity: 0.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                      {view === 'login_otp' 
                        ? `Welcome back, ${fetchedCustomer?.name || 'Customer'}! Enter the OTP sent to your email to confirm your booking.`
                        : `We are setting up your account using details: Name: ${name.trim()}, Phone: +91 ${phone.trim()}. Enter the OTP sent to your email to complete booking.`
                      }
                    </p>

                    {authError && (
                      <div style={{
                        background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171",
                        padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "1.5rem"
                      }}>
                        ⚠️ {authError}
                      </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleOtpVerifySubmit}>
                      <div className="flex flex-col gap-1">
                        <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>Enter 6-Digit OTP</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 123456" 
                          required 
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          style={{
                            padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)",
                            color: "white", fontSize: "1.15rem", textAlign: "center", letterSpacing: "5px", fontWeight: "bold"
                          }} 
                        />
                      </div>

                      <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                        {authLoading ? 'Verifying...' : view === 'login_otp' ? 'Verify & Send Request' : 'Verify, Register & Send Request'}
                      </button>

                      <button type="button" onClick={() => setView('email')} className="btn btn-secondary" style={{ width: "100%" }}>
                        Back to Email
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}



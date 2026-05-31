'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerLogin() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP verification
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSimulatedOtp, setIsSimulatedOtp] = useState(false);
  const [otpSentAlert, setOtpSentAlert] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Track existing customer details fetched on successful login-check
  const [fetchedCustomer, setFetchedCustomer] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to bookings page
    if (typeof window !== 'undefined') {
      const storedPhone = localStorage.getItem('customer_phone');
      if (storedPhone) {
        router.push('/bookings');
      }
    }
  }, [router]);

  // Clean phone input and allow only digits
  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, '');
    setPhone(digits.slice(0, 10)); // Max 10 digits
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    
    if (activeTab === 'login') {
      // Validation 1: Email format must meet standard structure
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid registered email address.');
        return;
      }

      setLoading(true);

      try {
        // Hit check API to verify if customer exists by email
        const checkRes = await fetch(`/api/customer/check?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        const checkData = await checkRes.json();

        if (!checkRes.ok || !checkData.registered) {
          // Switch to register tab automatically
          setActiveTab('register');
          setInfoMessage('We couldn\'t find an account with that email address, so we\'ve switched you to the "Create Account" tab! Please fill in your name and Indian mobile number to register.');
          setLoading(false);
          return;
        }

        // Save details of existing user to save in localStorage after verification
        setFetchedCustomer(checkData.customer);
      } catch (err) {
        console.error("Email login verification failed:", err);
        setError('Connection error. Please try again.');
        setLoading(false);
        return;
      }
    } else {
      // activeTab === 'register'
      const cleanPhone = phone.trim().replace(/\D/g, '');

      // Validation 1: Indian Mobile Number format (10 digits, starts with 6,7,8,9)
      const indianPhoneRegex = /^[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(cleanPhone)) {
        setError('Please enter a valid 10-digit Indian mobile number (should start with 6, 7, 8, or 9).');
        return;
      }

      // Validation 2: Name must not be empty and overall maximum 16 characters
      if (!name.trim()) {
        setError('Name is required.');
        return;
      }
      if (name.trim().length > 16) {
        setError('Name cannot exceed 16 characters.');
        return;
      }

      // Validation 3: Email format must meet standard structure
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address (e.g. name@domain.com).');
        return;
      }

      setLoading(true);

      try {
        // Hit check API to verify if phone already exists
        const checkPhoneRes = await fetch(`/api/customer/check?phone=${cleanPhone}`);
        const checkPhoneData = await checkPhoneRes.json();
        if (checkPhoneRes.ok && checkPhoneData.registered) {
          setError('This mobile number is already registered. Please click the "Log In" tab and use your email.');
          setLoading(false);
          return;
        }

        // Hit check API to verify if email already exists
        const checkEmailRes = await fetch(`/api/customer/check?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        const checkEmailData = await checkEmailRes.json();
        if (checkEmailRes.ok && checkEmailData.registered) {
          setError('This email address is already registered. Please click the "Log In" tab.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Signup validation failed:", err);
        setError('Connection error. Please try again.');
        setLoading(false);
        return;
      }
    }

    // Call customer OTP API to trigger real email OTP in production or simulated OTP banner
    try {
      const otpRes = await fetch('/api/customer/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: email.trim().toLowerCase() })
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setError(otpData.error || 'Failed to dispatch verification code. Please try again.');
        setLoading(false);
        return;
      }

      setGeneratedOtp(otpData.otp || '');
      setIsSimulatedOtp(otpData.simulated);
      setStep(2);
      setOtpSentAlert(true);
      setLoading(false);
    } catch (err) {
      console.error("OTP dispatch failed:", err);
      setError('Failed to connect to the authentication server. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call backend to verify the OTP securely
      const verifyRes = await fetch('/api/customer/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email: email.trim().toLowerCase(),
          otp: otp.trim()
        })
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error || 'Invalid OTP code. Please verify the code sent to your email.');
        setLoading(false);
        return;
      }

      if (activeTab === 'register') {
        // Call register API to write to Supabase
        const regRes = await fetch('/api/customer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim()
          })
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
          setError(regData.error || 'Registration failed. Please try again.');
          setLoading(false);
          return;
        }

        // Save new user profile to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('customer_phone', regData.customer.phone);
          localStorage.setItem('customer_name', regData.customer.name);
          localStorage.setItem('customer_email', regData.customer.email);
          window.dispatchEvent(new Event('customer-login-changed'));
          router.push('/bookings');
        }
      } else {
        // activeTab === 'login' - save fetched customer details
        if (typeof window !== 'undefined' && fetchedCustomer) {
          localStorage.setItem('customer_phone', fetchedCustomer.phone);
          localStorage.setItem('customer_name', fetchedCustomer.name);
          localStorage.setItem('customer_email', fetchedCustomer.email);
          window.dispatchEvent(new Event('customer-login-changed'));
          router.push('/bookings');
        }
      }
    } catch (err) {
      console.error("Final verification step error:", err);
      setError('Authentication server error. Please try again.');
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setOtp('');
    setGeneratedOtp('');
    setOtpSentAlert(false);
    setError('');
    setInfoMessage('');
    setIsSimulatedOtp(false);
    setFetchedCustomer(null);
  };

  const formatPhoneNumber = (num) => {
    if (num.length <= 5) return num;
    return `${num.slice(0, 5)} ${num.slice(5)}`;
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: "calc(100vh - 70px)", padding: "2.5rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "450px" }}>
        
        {/* Premium Simulated / Real OTP Gateway Banner */}
        {otpSentAlert && (
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
              <span style={{ fontSize: "1.25rem" }}>{isSimulatedOtp ? '✉️' : '🚀'}</span>
              <span style={{ 
                fontSize: "0.8rem", 
                opacity: 0.95, 
                color: isSimulatedOtp ? "var(--accent)" : "#10b981", 
                fontWeight: 700, 
                letterSpacing: "0.06em" 
              }}>
                {isSimulatedOtp ? 'SIMULATED EMAIL GATEWAY' : 'REAL-TIME OTP ROUTING'}
              </span>
            </div>
            <div style={{ fontSize: "0.9rem", color: "white" }}>
              <div>To: <strong>{email.trim()}</strong></div>
              {isSimulatedOtp ? (
                <div style={{ marginTop: "0.35rem", fontSize: "0.95rem" }}>
                  Your OTP to log in to Carpenterwala is <strong style={{ color: "var(--accent)", fontSize: "1.1rem", letterSpacing: "1px" }}>{generatedOtp}</strong>
                </div>
              ) : (
                <div style={{ marginTop: "0.35rem", fontSize: "0.9rem", opacity: 0.9 }}>
                  A secure 6-digit OTP code has been successfully dispatched to your email address. Please check your inbox (and spam folder) to complete your verification.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="glass animate-fade-in" style={{ padding: "2.5rem", width: "100%", borderRadius: "16px", boxShadow: "0 12px 45px rgba(0,0,0,0.35)" }}>
          
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center", fontWeight: 800 }}>
            Customer Portal
          </h1>
          <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "2rem", fontSize: "0.92rem" }}>
            {step === 1 ? 'Access your dashboard or create a new account.' : 'Verify your email address to continue.'}
          </p>

          {/* Form Tabs Switcher (Only visible in Step 1) */}
          {step === 1 && (
            <div style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: "10px",
              padding: "0.3rem",
              marginBottom: "1.75rem",
              border: "1px solid var(--glass-border)"
            }}>
              <button 
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); setInfoMessage(''); }}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "7px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: activeTab === 'login' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'login' ? 'white' : 'rgba(255, 255, 255, 0.65)'
                }}
              >
                🔑 Log In
              </button>
              <button 
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); setInfoMessage(''); }}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "7px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: activeTab === 'register' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'register' ? 'white' : 'rgba(255, 255, 255, 0.65)'
                }}
              >
                ✨ Create Account
              </button>
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#f87171",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.88rem",
              marginBottom: "1.5rem"
            }}>
              ⚠️ {error}
            </div>
          )}

          {infoMessage && (
            <div style={{
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              color: "#60a5fa",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.88rem",
              marginBottom: "1.5rem"
            }}>
              ℹ️ {infoMessage}
            </div>
          )}

          {step === 1 ? (
            <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
              
              {/* Login Email Field */}
              {activeTab === 'login' && (
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: "0.88rem", fontWeight: 600, opacity: 0.9 }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. amit@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem"
                    }} 
                  />
                </div>
              )}

              {/* Account Creation Fields */}
              {activeTab === 'register' && (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label style={{ fontSize: "0.88rem", fontWeight: 600, opacity: 0.9 }}>Your Name</label>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        opacity: name.length > 16 ? 1 : 0.6,
                        color: name.length > 16 ? "#f87171" : "inherit",
                        fontWeight: name.length > 0 ? 600 : 400
                      }}>
                        {name.length}/16 chars
                      </span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Sachin Tendulkar" 
                      required 
                      maxLength={16}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem"
                      }} 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label style={{ fontSize: "0.88rem", fontWeight: 600, opacity: 0.9 }}>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="sachin@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem"
                      }} 
                    />
                  </div>

                  {/* Mobile Number (Registration Only) */}
                  <div className="flex flex-col gap-1">
                    <label style={{ fontSize: "0.88rem", fontWeight: 600, opacity: 0.9 }}>Indian Mobile Number</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{
                        position: "absolute", left: "0.75rem", opacity: 0.7, fontSize: "0.95rem", fontWeight: 600
                      }}>+91</span>
                      <input 
                        type="tel" 
                        placeholder="9876543210" 
                        required 
                        maxLength={10}
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        style={{
                          padding: "0.75rem 0.75rem 0.75rem 2.6rem", width: "100%", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem", letterSpacing: "0.5px"
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: "0.75rem", opacity: 0.55, marginTop: "0.15rem" }}>
                      Only Indian 10-digit mobile numbers are supported.
                    </span>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ marginTop: "1rem", width: "100%", padding: "0.8rem", fontSize: "0.95rem" }}
              >
                {loading ? 'Processing...' : activeTab === 'register' ? 'Register & Send OTP' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, opacity: 0.9 }}>Enter 6-Digit OTP</label>
                  <button 
                    type="button" 
                    onClick={resetFlow}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    Edit Email
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. 123456" 
                  required 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "1.15rem", textAlign: "center", letterSpacing: "5px", fontWeight: "bold"
                  }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ marginTop: "1rem", width: "100%", padding: "0.8rem" }}
              >
                {loading ? 'Verifying...' : 'Verify & Log In'}
              </button>

              <button 
                type="button" 
                onClick={resetFlow} 
                className="btn btn-secondary" 
                style={{ width: "100%", padding: "0.8rem" }}
              >
                Cancel
              </button>
            </form>
          )}

          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", opacity: 0.8 }}>
            Are you a handyman professional?{' '}
            <Link href="/pro/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
              Pro Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

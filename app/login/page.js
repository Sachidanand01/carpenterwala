'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerLogin() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP verification
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSentAlert, setOtpSentAlert] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Proactively fetch customer name from past bookings if they exist
      const res = await fetch(`/api/customer/leads?phone=${encodeURIComponent(cleanPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.leads && data.leads.length > 0) {
          // Found an existing name from their bookings
          setName(data.leads[0].name);
        }
      }
    } catch (err) {
      console.warn("Could not prefetch existing user name:", err);
    }

    // Generate a mock 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    // Simulate API delay
    setTimeout(() => {
      setStep(2);
      setOtpSentAlert(true);
      setLoading(false);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.trim() !== generatedOtp) {
      setError('Invalid OTP code. Please enter the code displayed in the SMS gateway banner.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_phone', phone.trim());
        localStorage.setItem('customer_name', name.trim() || 'Valued Customer');
        window.dispatchEvent(new Event('customer-login-changed'));
        router.push('/bookings');
      }
    }, 500);
  };

  const resetFlow = () => {
    setStep(1);
    setOtp('');
    setGeneratedOtp('');
    setOtpSentAlert(false);
    setError('');
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: "calc(100vh - 70px)", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "450px" }}>
        
        {/* Mock SMS Gateway Notification */}
        {otpSentAlert && (
          <div className="glass animate-fade-in" style={{
            padding: "1.25rem",
            borderLeft: "4px solid var(--accent)",
            background: "rgba(245, 158, 11, 0.12)",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            boxShadow: "0 8px 32px rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderLeftWidth: "4px"
          }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "1.25rem" }}>💬</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.9, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.05em" }}>
                SIMULATED SMS GATEWAY
              </span>
            </div>
            <div style={{ fontSize: "0.9rem", color: "white" }}>
              <div>To: <strong>+91 {phone}</strong></div>
              <div style={{ marginTop: "0.35rem", fontSize: "0.95rem" }}>
                Your OTP to log in to Carpenterwala is <strong style={{ color: "var(--accent)", fontSize: "1.1rem", letterSpacing: "1px" }}>{generatedOtp}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="glass animate-fade-in" style={{ padding: "2.5rem", width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>
            Customer Login
          </h1>
          <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "2rem", fontSize: "0.95rem" }}>
            Enter your mobile number to view and track your booked handyman services.
          </p>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              marginBottom: "1.5rem"
            }}>
              ⚠️ {error}
            </div>
          )}

          {step === 1 ? (
            <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.9 }}>Mobile Number</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{
                    position: "absolute", left: "0.75rem", opacity: 0.6, fontSize: "0.95rem", fontWeight: 500
                  }}>+91</span>
                  <input 
                    type="tel" 
                    placeholder="9876543210" 
                    required 
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    style={{
                      padding: "0.75rem 0.75rem 0.75rem 2.5rem", width: "100%", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem"
                    }} 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.9 }}>Your Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Amit Kumar" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem"
                  }} 
                />
                <span style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.15rem" }}>
                  We will automatically search past bookings to find your profile details.
                </span>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ marginTop: "1rem", width: "100%" }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.9 }}>Enter 6-Digit OTP</label>
                  <button 
                    type="button" 
                    onClick={resetFlow}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
                  >
                    Edit Phone
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
                    padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "1.1rem", textAlign: "center", letterSpacing: "4px", fontWeight: "bold"
                  }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ marginTop: "1rem", width: "100%" }}
              >
                {loading ? 'Verifying...' : 'Verify & Log In'}
              </button>

              <button 
                type="button" 
                onClick={resetFlow} 
                className="btn btn-secondary" 
                style={{ width: "100%" }}
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

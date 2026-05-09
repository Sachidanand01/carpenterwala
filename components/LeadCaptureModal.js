'use client';
import { useState } from 'react';

export default function LeadCaptureModal({ proName, proId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId,
          name: e.target.name.value,
          phone: e.target.phone.value,
          task: e.target.task.value,
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
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

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary" 
        style={{ width: "100%", padding: "0.85rem" }}
      >
        Request Quote
      </button>

      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem"
        }}>
          <div className="glass animate-fade-in" style={{
            width: "100%", maxWidth: "450px", padding: "2rem", position: "relative",
            background: "var(--background)"
          }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}
            >
              &times;
            </button>
            
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Contact {proName}</h2>
            <p style={{ opacity: 0.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Fill out this short form and we'll route your request to {proName} securely.
            </p>

            {status === 'success' ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "#34d399" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
                <h3>Request Sent Successfully!</h3>
                <p style={{ opacity: 0.8, marginTop: "0.5rem" }}>{proName} will get back to you shortly.</p>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Your Name</label>
                  <input type="text" name="name" required style={{
                    padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                  }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Your Phone Number</label>
                  <input type="tel" name="phone" required style={{
                    padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
                  }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Task Description</label>
                  <textarea name="task" required rows="3" placeholder="What do you need help with?" style={{
                    padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white", resize: "vertical"
                  }}></textarea>
                </div>
                
                <button type="submit" disabled={status === 'loading'} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                  {status === 'loading' ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

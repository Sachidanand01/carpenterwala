'use client';
import { useState } from 'react';

export default function ProLogin() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: "calc(100vh - 70px)" }}>
      <div className="glass animate-fade-in" style={{ width: "100%", maxWidth: "450px", padding: "2.5rem" }}>
        
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>
          {isLogin ? "Welcome Back, Pro" : "Join Carpenterwala"}
        </h1>
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "2rem" }}>
          {isLogin ? "Log in to manage your digital shopfront." : "Create your profile and start getting leads."}
        </p>

        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert('Authentication will be powered by Supabase soon!'); }}>
          
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Full Name</label>
              <input type="text" placeholder="e.g. Ram Singh" required style={{
                padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
              }} />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Email Address</label>
            <input type="email" placeholder="pro@example.com" required style={{
              padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
            }} />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Password</label>
            <input type="password" placeholder="••••••••" required style={{
              padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "white"
            }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
            {isLogin ? "Log In" : "Register"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>

      </div>
    </div>
  );
}

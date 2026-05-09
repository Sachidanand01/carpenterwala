export default function VerifiedBadge() {
  return (
    <span 
      title="Carpenterwala Verified"
      style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: "4px",
        padding: "0.25rem 0.5rem", 
        background: "rgba(16, 185, 129, 0.2)", 
        color: "#34d399",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        borderRadius: "20px", 
        fontSize: "0.75rem",
        fontWeight: 600
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      Verified
    </span>
  );
}

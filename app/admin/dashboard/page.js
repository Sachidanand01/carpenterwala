import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Prevent Next.js from caching this page so we always see new leads

export default async function AdminDashboard() {
  // Fetch leads from Supabase, joining with the profiles table to get the pro's name
  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      id,
      name,
      phone,
      task,
      created_at,
      profiles ( name, trade )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Failed to load leads:", error);
  }

  // Calculate some simple analytics
  const totalLeads = leads?.length || 0;
  
  // Just dummy values for these two for now unless we do complex counting
  const topDemand = "Carpentry";
  const { count: activeProfiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  return (
    <div className="container flex-col gap-8" style={{ padding: "3rem 0" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Admin Dashboard</h1>
      
      <div className="flex gap-4" style={{ marginBottom: "2rem", flexWrap: "wrap" }}>
        <div className="glass flex-col items-center justify-center" style={{ flex: 1, minWidth: "200px", padding: "2rem" }}>
          <h3 style={{ opacity: 0.8, fontSize: "1rem" }}>Total Leads</h3>
          <span style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--primary)" }}>{totalLeads}</span>
        </div>
        <div className="glass flex-col items-center justify-center" style={{ flex: 1, minWidth: "200px", padding: "2rem" }}>
          <h3 style={{ opacity: 0.8, fontSize: "1rem" }}>Top Profession Demand</h3>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>{topDemand}</span>
        </div>
        <div className="glass flex-col items-center justify-center" style={{ flex: 1, minWidth: "200px", padding: "2rem" }}>
          <h3 style={{ opacity: 0.8, fontSize: "1rem" }}>Active Profiles</h3>
          <span style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--accent)" }}>{activeProfiles || 0}</span>
        </div>
      </div>

      <div className="glass" style={{ padding: "2rem", overflowX: "auto" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Recent Lead Routing</h2>
        <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", opacity: 0.8 }}>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Professional</th>
              <th style={{ padding: "1rem" }}>Customer</th>
              <th style={{ padding: "1rem" }}>Phone</th>
              <th style={{ padding: "1rem" }}>Task Requested</th>
            </tr>
          </thead>
          <tbody>
            {leads && leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem" }}>{new Date(lead.created_at).toLocaleString()}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ fontWeight: 600 }}>{lead.profiles?.name || 'Unknown'}</span>
                  <br />
                  <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{lead.profiles?.trade || 'N/A'}</span>
                </td>
                <td style={{ padding: "1rem" }}>{lead.name}</td>
                <td style={{ padding: "1rem" }}>{lead.phone}</td>
                <td style={{ padding: "1rem" }}>{lead.task}</td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr>
                <td colSpan="5" style={{ padding: "2rem", textAlign: "center", opacity: 0.5 }}>No leads found in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

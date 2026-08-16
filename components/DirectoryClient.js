"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import VerifiedBadge from "@/components/VerifiedBadge";
import Breadcrumbs from "@/components/Breadcrumbs";

// Helper for distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const ALL_LANGUAGES = ["Kannada", "Hindi", "English", "Tamil", "Telugu"];

function DirectoryContent() {
  const searchParams = useSearchParams();
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // User location & city
  const [userLocation, setUserLocation] = useState(null);
  const [detectedCity, setDetectedCity] = useState("Bangalore");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Filters state
  const [category, setCategory] = useState(searchParams?.get('category') || "All");
  const [maxDistance, setMaxDistance] = useState("Any");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  // Sort state (Rating by default)
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    async function loadDirectory() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("verified", true);
      if (error) {
        console.error("Error loading profiles", error);
      } else {
        setAllProfiles(data || []);
      }
      setLoading(false);
    }
    loadDirectory();
  }, []);

  // 1. Automatic IP-based city detection on page load
  useEffect(() => {
    async function detectCityByIp() {
      try {
        const res = await fetch("/api/geo");
        if (res.ok) {
          const data = await res.json();
          if (data && data.city && data.city.trim().length > 0) {
            setDetectedCity(data.city.trim());
          }
        }
      } catch (err) {
        console.warn("IP city lookup notice:", err);
      }
    }
    detectCityByIp();
  }, []);

  // 2. High-precision GPS location & Reverse Geocoding
  const requestLocation = () => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      setLocationError("");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setLocationLoading(false);

          // Reverse geocode coordinates to update city dynamically
          try {
            const revRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            if (revRes.ok) {
              const revData = await revRes.json();
              const city = revData.city || revData.locality || revData.principalSubdivision;
              if (city) {
                setDetectedCity(city.trim());
              }
            }
          } catch (e) {
            console.warn("Reverse geocoding error:", e);
          }
        },
        (error) => {
          setLocationLoading(false);
          setLocationError("Could not access your location. Please check browser permissions.");
        },
        { timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  // Toggle language selection
  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allProfiles];

    // 1. Filter by Category
    if (category !== "All") {
      result = result.filter(
        (p) => p.trade.toLowerCase() === category.toLowerCase()
      );
    }

    // 2. Filter by Language
    if (selectedLanguages.length > 0) {
      result = result.filter((p) => {
        const proLangs = p.languages || [];
        return selectedLanguages.some((lang) => proLangs.includes(lang));
      });
    }

    // 3. Filter by Distance
    if (maxDistance !== "Any" && userLocation) {
      const radius = parseFloat(maxDistance);
      result = result.filter((p) => {
        const dist = getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          p.latitude,
          p.longitude
        );
        if (dist === null) return false;
        return dist <= radius;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return (b.average_rating || 0) - (a.average_rating || 0);
      } else if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

    setFilteredProfiles(result);
  }, [allProfiles, category, maxDistance, selectedLanguages, sortBy, userLocation]);

  return (
    <div className="flex gap-8" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* Style Overrides for Filter Selects */}
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-filter-select {
            width: 100%;
            padding: 0.65rem 2.2rem 0.65rem 0.85rem;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
            background-color: var(--background, #FAF8F5);
            color: var(--foreground, #0F172A);
            font-size: 0.92rem;
            font-weight: 600;
            outline: none;
            cursor: pointer;
            transition: var(--transition);
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C2410C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          }
          .custom-filter-select:hover {
            border-color: var(--primary);
            background-color: #fff;
          }
          .custom-filter-select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-light);
            background-color: #fff;
          }
          .custom-filter-select option {
            background-color: #FAF8F5;
            color: #0F172A;
            padding: 0.5rem;
          }
        `}} />

        {/* SIDEBAR FILTERS */}
        <aside className="glass" style={{ width: "100%", maxWidth: "300px", padding: "1.75rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Filters</h2>
            {detectedCity && (
              <span style={{ 
                fontSize: "0.78rem", 
                fontWeight: 600, 
                color: "var(--primary)", 
                background: "var(--primary-light)", 
                padding: "0.2rem 0.55rem", 
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                📍 {detectedCity}
              </span>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.45rem", fontWeight: "600", fontSize: "0.9rem", color: "var(--foreground)" }}>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="custom-filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Carpenter">Carpenters</option>
              <option value="Painter">Painters</option>
              <option value="Electrician">Electricians</option>
              <option value="Plumber">Plumbers</option>
            </select>
          </div>

          {/* Sorting */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.45rem", fontWeight: "600", fontSize: "0.9rem", color: "var(--foreground)" }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="custom-filter-select"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Newly Added</option>
              <option value="oldest">Oldest Profiles</option>
            </select>
          </div>

          {/* Distance */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.45rem", fontWeight: "600", fontSize: "0.9rem", color: "var(--foreground)" }}>Distance (Nearby)</label>
            {!userLocation ? (
              <button 
                onClick={requestLocation}
                disabled={locationLoading}
                className="btn btn-secondary"
                style={{ 
                  fontSize: "0.88rem", 
                  padding: "0.65rem 0.85rem", 
                  width: "100%", 
                  borderRadius: "10px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.4rem", 
                  fontWeight: 600,
                  color: "var(--primary)",
                  borderColor: "var(--glass-border)"
                }}
              >
                <span>📍</span>
                <span>{locationLoading ? "Detecting Location..." : "Enable Location to filter"}</span>
              </button>
            ) : (
              <select 
                value={maxDistance} 
                onChange={(e) => setMaxDistance(e.target.value)}
                className="custom-filter-select"
              >
                <option value="Any">Any Distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
              </select>
            )}
            {locationError && (
              <p style={{ 
                color: "var(--error, #b91c1c)", 
                background: "var(--error-bg, rgba(220,38,38,0.08))", 
                fontSize: "0.8rem", 
                marginTop: "0.5rem", 
                padding: "0.4rem 0.6rem", 
                borderRadius: "6px" 
              }}>
                ⚠️ {locationError}
              </p>
            )}
          </div>

          {/* Languages */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "0.9rem", color: "var(--foreground)" }}>Languages Spoken</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {ALL_LANGUAGES.map(lang => (
                <label key={lang} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--foreground)" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                    style={{ 
                      accentColor: "var(--primary)",
                      width: "16px",
                      height: "16px",
                      cursor: "pointer"
                    }}
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Safety & Fraud Guide Card */}
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--glass-border)" }}>
            <h4 style={{ fontSize: "1rem", color: "var(--primary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              🛡️ Avoid Carpenter Fraud
            </h4>
            <p style={{ fontSize: "0.83rem", opacity: 0.85, lineHeight: "1.5", color: "var(--foreground-muted)" }}>
              Want to avoid a fake handyman or <strong>carpenter fraud in India</strong>? Make sure to hire only background-checked, verified professionals. Carpenterwala physically verifies all tradesmen identity records, certifications, and customer reviews before approval.
            </p>
          </div>
        </aside>

        {/* RESULTS GRID */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {loading ? (
            <p>Loading professionals...</p>
          ) : filteredProfiles.length === 0 ? (
            <div className="glass" style={{ padding: "3rem", textAlign: "center" }}>
              <h2>No professionals found</h2>
              <p style={{ opacity: 0.7 }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {filteredProfiles.map((pro) => (
                <Link href={`/${pro.slug}`} key={pro.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="glass" style={{ padding: "1.5rem", transition: "transform 0.2s", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }} 
                       onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                       onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      {pro.avatar ? (
                        <img src={pro.avatar} alt={pro.name} width={60} height={60} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {pro.name[0]}
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontSize: "1.1rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {pro.name} {pro.verified && <VerifiedBadge />}
                        </h3>
                        <p style={{ margin: 0, opacity: 0.75, fontSize: "0.9rem", color: "var(--foreground-muted)" }}>{pro.trade}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        ⭐ {pro.average_rating ? pro.average_rating.toFixed(1) : "New"}
                      </span>
                      <span style={{ opacity: 0.75 }}>📍 {pro.location}</span>
                    </div>

                    <div style={{ marginBottom: "1rem", flex: 1 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {(pro.skills || []).slice(0, 3).map(skill => (
                          <span key={skill} style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 500 }}>
                            {skill}
                          </span>
                        ))}
                        {(pro.skills || []).length > 3 && (
                          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>+{pro.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {pro.languages && pro.languages.length > 0 && (
                      <div style={{ fontSize: "0.8rem", opacity: 0.75, borderTop: "1px solid var(--glass-border)", paddingTop: "0.8rem", color: "var(--foreground-muted)" }}>
                        🗣️ {pro.languages.join(", ")}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Dynamic Search Engine Information Block */}
          <div className="glass" style={{ padding: "3rem", marginTop: "4rem", lineHeight: "1.7", borderRadius: "16px" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>
              How to Find a Professional Handyman in <span className="text-gradient">{detectedCity}</span>
            </h2>
            <p style={{ marginBottom: "1.2rem", color: "var(--foreground-muted)" }}>
              Finding reliable help for your home repairs can be hard. Whether you need to <strong>find a professional</strong> for custom woodwork, a local painter in <strong>{detectedCity}</strong>, or a trusted electrician, we make it simple and transparent. Our directory lists top-rated, local professionals across different trades.
            </p>
            <p style={{ marginBottom: "1.2rem", color: "var(--foreground-muted)" }}>
              Every handyman on our platform is background-checked and verified by our team. This helps you avoid common scams and <strong>carpenter fraud in India</strong>. You can easily filter profiles by trade, how close they are to your location, and the languages they speak.
            </p>
            <p style={{ marginBottom: "1.2rem", color: "var(--foreground-muted)" }}>
              Before you <strong>hire verified carpenter</strong> or other repair services in <strong>{detectedCity}</strong>, you can check their profile ratings, read customer reviews, and see photos of their past projects. If you have any questions or need help, feel free to visit our Help Center or contact our friendly support team.
            </p>
          </div>
        </div>

      </div>
  );
}

export default function DirectoryClient() {
  return (
    <div className="container" style={{ padding: "2rem 0 4rem 0" }}>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Find a Professional", url: "/find-a-professional" }
      ]} />
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Find a Professional</h1>
        <p style={{ opacity: 0.8, fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
          Browse our verified handymen. Filter by trade, location, and languages.
        </p>
      </div>

      <Suspense fallback={<div style={{ padding: "5rem", textAlign: "center" }}>Loading Directory...</div>}>
        <DirectoryContent />
      </Suspense>
    </div>
  );
}


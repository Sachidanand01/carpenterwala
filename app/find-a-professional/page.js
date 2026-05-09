"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import VerifiedBadge from "@/components/VerifiedBadge";

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

  // User location
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Filters state
  const [category, setCategory] = useState(searchParams?.get('category') || "All");
  const [maxDistance, setMaxDistance] = useState("Any");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  // Sort state (Rating by default)
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    async function loadDirectory() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error loading profiles", error);
      } else {
        setAllProfiles(data || []);
      }
      setLoading(false);
    }
    loadDirectory();
  }, []);

  // Handle location request
  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          setLocationError("Could not get your location. Please allow access.");
        }
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
    // If no languages selected, show all (default behavior)
    if (selectedLanguages.length > 0) {
      result = result.filter((p) => {
        const proLangs = p.languages || [];
        // Check if the pro has AT LEAST ONE of the selected languages
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
        // Include if within radius or if we don't have pro's coordinates but we want to show them?
        // Usually, if we strictly filter, we exclude those without coordinates.
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
    <div className="container" style={{ padding: "3rem 0" }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Find a Professional</h1>
        <p style={{ opacity: 0.8, fontSize: "1.1rem" }}>
          Browse our verified handymen. Filter by trade, location, and languages.
        </p>
      </div>

      <div className="flex gap-8" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* SIDEBAR FILTERS */}
        <aside className="glass" style={{ width: "100%", maxWidth: "300px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Filters</h2>

          {/* Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "white" }}
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
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "white" }}
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Newly Added</option>
              <option value="oldest">Oldest Profiles</option>
            </select>
          </div>

          {/* Distance */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Distance (Nearby)</label>
            {!userLocation ? (
              <button 
                onClick={requestLocation}
                style={{ fontSize: "0.9rem", padding: "0.5rem", width: "100%", backgroundColor: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}
              >
                📍 Enable Location to filter
              </button>
            ) : (
              <select 
                value={maxDistance} 
                onChange={(e) => setMaxDistance(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "white" }}
              >
                <option value="Any">Any Distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
              </select>
            )}
            {locationError && <p style={{ color: "#ff4444", fontSize: "0.8rem", marginTop: "0.5rem" }}>{locationError}</p>}
          </div>

          {/* Languages */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Languages Spoken</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ALL_LANGUAGES.map(lang => (
                <label key={lang} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                  />
                  {lang}
                </label>
              ))}
            </div>
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
                        <img src={pro.avatar} alt={pro.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {pro.name[0]}
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontSize: "1.1rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {pro.name} {pro.verified && <VerifiedBadge />}
                        </h3>
                        <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>{pro.trade}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        ⭐ {pro.average_rating ? pro.average_rating.toFixed(1) : "New"}
                      </span>
                      <span style={{ opacity: 0.7 }}>📍 {pro.location}</span>
                    </div>

                    <div style={{ marginBottom: "1rem", flex: 1 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {(pro.skills || []).slice(0, 3).map(skill => (
                          <span key={skill} style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem" }}>
                            {skill}
                          </span>
                        ))}
                        {(pro.skills || []).length > 3 && (
                          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>+{pro.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {pro.languages && pro.languages.length > 0 && (
                      <div style={{ fontSize: "0.8rem", opacity: 0.6, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.8rem" }}>
                        🗣️ {pro.languages.join(", ")}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Directory() {
  return (
    <Suspense fallback={<div style={{ padding: "5rem", textAlign: "center" }}>Loading Directory...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}

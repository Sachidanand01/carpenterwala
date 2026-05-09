"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Hardcoded initial service catalog
const SERVICES_DATA = [
  { id: 'Carpenter', name: 'Carpenter', image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=500&q=80', desc: 'Expert woodwork, furniture repair, and custom fitting.' },
  { id: 'Painter', name: 'Painter', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80', desc: 'Interior and exterior painting, waterproofing.' },
  { id: 'Electrician', name: 'Electrician', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80', desc: 'Wiring, fixture installation, and electrical repairs.' },
  { id: 'Plumber', name: 'Plumber', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80', desc: 'Pipe repair, fixture installation, and leak fixing.' },
  { id: 'Welder', name: 'Welder', image: 'https://images.unsplash.com/photo-1504917595217-d4bf88015386?w=500&q=80', desc: 'Metal fabrication, welding repairs, and grill work.' },
  { id: 'Mason', name: 'Mason', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&q=80', desc: 'Brickwork, plastering, and structural repairs.' },
  { id: 'AC Technician', name: 'AC Technician', image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500&q=80', desc: 'AC installation, servicing, and gas refilling.' },
  { id: 'Pest Control', name: 'Pest Control', image: 'https://images.unsplash.com/photo-1586820257451-2470bf75b11c?w=500&q=80', desc: 'Termite, cockroach, and general pest elimination.' },
  { id: 'Deep Cleaning', name: 'Deep Cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', desc: 'Full home deep cleaning, sanitization, and dusting.' },
  { id: 'Gardener', name: 'Gardener', image: 'https://images.unsplash.com/photo-1416879598446-cc8b9fdf934f?w=500&q=80', desc: 'Lawn maintenance, planting, and landscape care.' },
  { id: 'Roofer', name: 'Roofer', image: 'https://images.unsplash.com/photo-1632154939737-25e2439a3f2b?w=500&q=80', desc: 'Roof repairs, waterproofing, and tile replacement.' },
  { id: 'Flooring', name: 'Flooring Expert', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=500&q=80', desc: 'Tile laying, wooden flooring, and marble polishing.' },
];

const BATCH_SIZE = 4;

export default function ServicesPage() {
  const [sortedServices, setSortedServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [locationState, setLocationState] = useState("Prompting..."); // Prompting, Allowed, Denied
  
  const loaderRef = useRef(null);

  useEffect(() => {
    // 1. On mount, prompt for location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState("Allowed");
          fetchAndSortServices(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationState("Denied");
          // Fetch without location (global popularity)
          fetchAndSortServices(null, null);
        }
      );
    } else {
      setLocationState("Denied");
      fetchAndSortServices(null, null);
    }
  }, []);

  // Fetch profiles and aggregate counts
  const fetchAndSortServices = async (userLat, userLng) => {
    const { data: profiles, error } = await supabase.from("profiles").select("trade, latitude, longitude");
    
    if (error) {
      console.error("Error fetching profiles:", error);
      setLoading(false);
      return;
    }

    // Aggregate counts
    const tradeCounts = {};
    SERVICES_DATA.forEach(s => tradeCounts[s.id] = 0);

    profiles?.forEach(pro => {
      // If we have user location, only count pros within roughly 20km for "local popularity"
      let isLocal = true;
      if (userLat && userLng && pro.latitude && pro.longitude) {
        const dist = getDistanceFromLatLonInKm(userLat, userLng, pro.latitude, pro.longitude);
        if (dist > 20) isLocal = false;
      }

      if (isLocal) {
        // Normalize trade name
        const trade = pro.trade;
        if (tradeCounts[trade] !== undefined) {
          tradeCounts[trade]++;
        }
      }
    });

    // Merge counts into services array and sort by count descending
    const servicesWithCounts = SERVICES_DATA.map(s => ({
      ...s,
      proCount: tradeCounts[s.id] || 0
    })).sort((a, b) => b.proCount - a.proCount);

    setSortedServices(servicesWithCounts);
    setDisplayedServices(servicesWithCounts.slice(0, BATCH_SIZE));
    setLoading(false);
  };

  // Infinite Scroll Logic using IntersectionObserver
  useEffect(() => {
    if (loading || displayedServices.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      // If we scroll near the loader, load next batch
      if (target.isIntersecting && displayedServices.length < sortedServices.length) {
        setPage(prev => prev + 1);
      }
    }, {
      root: null,
      rootMargin: "200px", // Trigger when 200px away from the bottom of the loader
      threshold: 0
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, displayedServices, sortedServices]);

  // When page state changes, append new batch
  useEffect(() => {
    if (page > 1) {
      const nextBatch = sortedServices.slice(0, page * BATCH_SIZE);
      setDisplayedServices(nextBatch);
    }
  }, [page, sortedServices]);

  return (
    <div className="container" style={{ padding: "4rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Our Services</h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>
          From minor repairs to major renovations, find the right expert for your home.
        </p>
        {locationState === "Allowed" && (
          <p style={{ marginTop: "1rem", color: "#4caf50", fontSize: "0.9rem" }}>
            📍 Showing most popular services in your area
          </p>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem" }}>
          <h2>Loading services...</h2>
          <p>Analyzing local availability</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {displayedServices.map((service, index) => {
            const isTopPopular = index < 2 && service.proCount > 0;
            
            return (
              <div key={service.id} className="glass" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "200px" }}>
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  {isTopPopular && (
                    <div style={{ position: "absolute", top: "10px", right: "10px", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", color: "white", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                      🔥 Most Popular
                    </div>
                  )}
                </div>
                
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{service.name}</h2>
                  <p style={{ opacity: 0.8, marginBottom: "1.5rem", flex: 1 }}>{service.desc}</p>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      🧑‍🔧 <strong>{service.proCount}</strong> professionals available
                    </span>
                  </div>

                  {service.proCount > 0 ? (
                    <Link 
                      href={`/find-a-professional?category=${service.id}`} 
                      className="btn btn-primary" 
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      Pick Service Professional
                    </Link>
                  ) : (
                    <div style={{ textAlign: "center", padding: "0.8rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", color: "rgba(255,255,255,0.6)" }}>
                      Pros are getting added
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invisible element to track scroll for Intersection Observer */}
      {!loading && displayedServices.length < sortedServices.length && (
        <div ref={loaderRef} style={{ padding: "2rem", textAlign: "center", opacity: 0.5 }}>
          Loading more services...
        </div>
      )}
    </div>
  );
}

// Distance helper
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}
function deg2rad(deg) { return deg * (Math.PI / 180); }

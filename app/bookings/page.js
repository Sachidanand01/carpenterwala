'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.35rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0',
            fontSize: '2rem', color: star <= (hovered || value) ? '#f59e0b' : 'rgba(255,255,255,0.2)',
            transition: 'color 0.15s', lineHeight: 1
          }}>★</button>
      ))}
    </div>
  );
}

function ReviewModal({ booking, customerName, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pro_id: booking.profiles?.id,
          author: customerName || 'Anonymous',
          rating,
          text,
        }),
      });
      if (res.ok) {
        onSubmitted(booking.id);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit. Try again.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%', maxWidth: '480px', padding: '2rem',
        borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Rate Your Experience</h2>
            <p style={{ opacity: 0.65, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              with <strong>{booking.profiles?.name || 'this professional'}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white', fontSize: '1.5rem',
            cursor: 'pointer', opacity: 0.6, lineHeight: 1
          }}>×</button>
        </div>

        {/* Pro info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
          background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1.5rem'
        }}>
          <img src={booking.profiles?.avatar || `https://i.pravatar.cc/80?u=${booking.profiles?.name}`}
            alt={booking.profiles?.name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{booking.profiles?.name}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{booking.profiles?.trade} · {booking.profiles?.location}</div>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', padding: '0.6rem 1rem', borderRadius: '8px',
            fontSize: '0.88rem', marginBottom: '1rem'
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              Your Rating <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <span style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.3rem', display: 'block' }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
              </span>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              Your Review <span style={{ opacity: 0.5 }}>(optional)</span>
            </label>
            <textarea rows={3} placeholder="Tell others about your experience..."
              value={text} onChange={e => setText(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                color: 'white', fontSize: '0.9rem', resize: 'vertical'
              }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RebookModal({ booking, customerName, customerPhone, onClose, onSubmitted }) {
  const [task, setTask] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) { setError('Please describe the task you need help with.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId: booking.profiles?.id,
          name: customerName,
          phone: customerPhone,
          task,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSubmitted();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit booking request. Try again.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%', maxWidth: '480px', padding: '2rem',
        borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Re-book Professional</h2>
            <p style={{ opacity: 0.65, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Book the same service and professional
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white', fontSize: '1.5rem',
            cursor: 'pointer', opacity: 0.6, lineHeight: 1
          }}>×</button>
        </div>

        {/* Pro info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
          background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1.5rem'
        }}>
          <img src={booking.profiles?.avatar || `https://i.pravatar.cc/80?u=${booking.profiles?.name}`}
            alt={booking.profiles?.name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{booking.profiles?.name}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{booking.profiles?.trade} · {booking.profiles?.location}</div>
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#34d399" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✓</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Booking Request Sent!</h3>
            <p style={{ opacity: 0.8, marginTop: "0.5rem", fontSize: '0.9rem' }}>
              We have dispatched your request to {booking.profiles?.name || 'the professional'}.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', padding: '0.6rem 1rem', borderRadius: '8px',
                fontSize: '0.88rem', marginBottom: '1rem'
              }}>⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  What do you need help with? <span style={{ color: '#3b82f6' }}>*</span>
                </label>
                <textarea rows={3} required
                  placeholder="Describe your new task or project in detail..."
                  value={task} onChange={e => setTask(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                    color: 'white', fontSize: '0.9rem', resize: 'vertical'
                  }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? 'Sending Request...' : 'Confirm Re-book'}
                </button>
                <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function BookingsDashboard() {
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null); // booking object
  const [rebookModal, setRebookModal] = useState(null); // booking object
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem('customer_phone');
      const name = localStorage.getItem('customer_name');
      if (!phone) { router.push('/login'); return; }
      setCustomer({ phone, name });
      fetchBookings(phone);
    }
  }, [router]);

  const fetchBookings = async (phone) => {
    try {
      const res = await fetch(`/api/customer/leads?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (createdAt) => {
    const diffHours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    if (diffHours < 24) return { text: 'Quote Requested', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    if (diffHours < 48) return { text: 'Pro Contacting You', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' };
    return { text: 'Job Completed', color: '#10b981', bg: 'rgba(16,185,129,0.15)' };
  };

  const isCompleted = (createdAt) =>
    (new Date() - new Date(createdAt)) / (1000 * 60 * 60) >= 48;

  const handleReviewSubmitted = (bookingId) => {
    setReviewedIds(prev => new Set([...prev, bookingId]));
    setReviewModal(null);
  };

  const handleRebookSubmitted = () => {
    setRebookModal(null);
    if (customer && customer.phone) {
      fetchBookings(customer.phone);
    }
  };

  if (!customer) return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <p style={{ opacity: 0.8 }}>Redirecting to login...</p>
    </div>
  );

  return (
    <div className="container flex-col gap-8" style={{ padding: '3rem 0' }}>

      {/* Review Modal */}
      {reviewModal && (
        <ReviewModal
          booking={reviewModal}
          customerName={customer.name}
          onClose={() => setReviewModal(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Re-book Modal */}
      {rebookModal && (
        <RebookModal
          booking={rebookModal}
          customerName={customer.name}
          customerPhone={customer.phone}
          onClose={() => setRebookModal(null)}
          onSubmitted={handleRebookSubmitted}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center flex-mobile-col gap-4"
        style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px' }}>CUSTOMER PORTAL</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.25rem' }}>Hello, {customer.name}!</h1>
          <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Registered Mobile: +91 {customer.phone}</p>
        </div>
        <Link href="/find-a-professional" className="btn btn-primary">+ Book Another Service</Link>
      </div>

      {/* Stats */}
      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Total Jobs Booked', value: bookings.length, color: 'var(--primary)' },
          { label: 'Active / Pending', value: bookings.filter(b => !isCompleted(b.created_at)).length, color: 'var(--accent)' },
          { label: 'Completed', value: bookings.filter(b => isCompleted(b.created_at)).length, color: '#10b981' },
          { label: 'Reviews Given', value: reviewedIds.size, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ flex: 1, minWidth: '150px', padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ opacity: 0.7, fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>{label}</h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Your Booking History</h2>

        {loading ? (
          <div className="glass flex items-center justify-center" style={{ padding: '4rem', textAlign: 'center' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass flex-col items-center justify-center" style={{ padding: '4rem 2rem', textAlign: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>📭</span>
            <h3>No bookings found!</h3>
            <p style={{ opacity: 0.8, maxWidth: '500px', margin: '0 auto 1rem' }}>
              You haven't booked any handyman services yet. Reach out to our verified pros to get started.
            </p>
            <Link href="/find-a-professional" className="btn btn-primary">Find a Professional Now</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map(booking => {
              const status = getStatus(booking.created_at);
              const completed = isCompleted(booking.created_at);
              const reviewed = reviewedIds.has(booking.id);
              return (
                <div key={booking.id} className="glass" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>

                    {/* Left: Pro info */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                      <img
                        src={booking.profiles?.avatar || `https://i.pravatar.cc/150?u=${booking.profiles?.name || 'unknown'}`}
                        alt={booking.profiles?.name || 'Pro'}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)', flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.2rem' }}>{booking.profiles?.name || 'Handyman Pro'}</h3>
                          <span className="text-gradient" style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.1rem 0.6rem', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
                            {booking.profiles?.trade || 'Handyman'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: '0.2rem' }}>
                          📍 {booking.profiles?.location || 'Bangalore'}
                        </p>
                        <div style={{ marginTop: '0.9rem' }}>
                          <span style={{ fontSize: '0.8rem', opacity: 0.55, fontWeight: 500, letterSpacing: '0.5px' }}>TASK:</span>
                          <p style={{ marginTop: '0.15rem', fontSize: '0.95rem' }}>{booking.task}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status + actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', minWidth: '190px' }}>
                      <div style={{
                        background: status.bg, color: status.color,
                        padding: '0.4rem 0.9rem', borderRadius: '20px',
                        fontSize: '0.82rem', fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                      }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status.color }} />
                        {status.text}
                      </div>

                      <span style={{ fontSize: '0.78rem', opacity: 0.55 }}>
                        {new Date(booking.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>

                      {/* View Pro Profile */}
                      {booking.profiles?.slug && (
                        <Link href={`/${booking.profiles.slug}`}
                          style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>
                          View Profile ↗
                        </Link>
                      )}

                      {/* Re-book Professional */}
                      {booking.profiles && (
                        <button
                          onClick={() => setRebookModal(booking)}
                          className="btn btn-primary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.5rem 1rem',
                            marginTop: '0.5rem',
                            width: '100%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))'
                          }}
                        >
                          🔄 Re-book Professional
                        </button>
                      )}

                      {/* Leave a Review — only for completed jobs */}
                      {completed && (
                        reviewed ? (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            color: '#34d399', fontSize: '0.85rem', fontWeight: 600,
                            background: 'rgba(52,211,153,0.1)', padding: '0.4rem 0.8rem',
                            borderRadius: '8px', marginTop: '0.5rem', width: '100%', justifyContent: 'center'
                          }}>
                            ✓ Review Submitted
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewModal(booking)}
                            style={{
                              marginTop: '0.5rem', padding: '0.5rem 1rem',
                              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))',
                              border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px',
                              color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))'}
                          >
                            ⭐ Leave a Review
                          </button>
                        )
                      )}

                      {!completed && (
                        <button
                          onClick={() => alert(`We've notified ${booking.profiles?.name || 'the professional'}. They will contact you at +91 ${booking.phone}.`)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginTop: '0.5rem', width: '100%' }}
                        >
                          Request Call Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogComments({ blogSlug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  
  // User auth state: { name, email, role }
  const [user, setUser] = useState(null);
  
  // UI states
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptAction, setPromptAction] = useState(''); // 'comment' or 'reaction'
  const [submitting, setSubmitting] = useState(false);
  const [reactionLoadingId, setReactionLoadingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

  const router = useRouter();

  // 1. Check login state & handle redirects/pending actions
  useEffect(() => {
    const initAuthAndComments = async () => {
      let loggedInUser = null;

      if (typeof window !== 'undefined') {
        const customerPhone = localStorage.getItem('customer_phone');
        const proId = localStorage.getItem('pro_id');

        if (customerPhone) {
          loggedInUser = {
            role: 'customer',
            name: localStorage.getItem('customer_name') || 'Customer',
            email: localStorage.getItem('customer_email') || '',
          };
          setUser(loggedInUser);
        } else if (proId) {
          // Set pro temp details immediately to prevent latency
          const tempPro = {
            role: 'pro',
            name: localStorage.getItem('pro_name') || 'Service Professional',
            email: '',
          };
          setUser(tempPro);

          // Fetch real profile to get the email address
          try {
            const res = await fetch(`/api/pro/profile?id=${proId}`);
            if (res.ok) {
              const data = await res.json();
              if (data.profile) {
                loggedInUser = {
                  role: 'pro',
                  name: data.profile.name,
                  email: data.profile.email,
                };
                setUser(loggedInUser);
              }
            }
          } catch (e) {
            console.error('Error fetching pro profile details:', e);
          }
        }
      }

      // Fetch comments first
      const fetchedComments = await fetchComments(loggedInUser?.email || '');

      // Handle any pending actions from sessionStorage (after returning from registration)
      if (loggedInUser) {
        // A. Restore pending comment text
        const pendingText = sessionStorage.getItem('pending_comment_text');
        if (pendingText) {
          setNewCommentText(pendingText);
          sessionStorage.removeItem('pending_comment_text');
          setMessage({ text: 'Welcome back! Your comment draft has been restored below. Please review and submit.', type: 'success' });
          
          // Scroll smoothly to comments section
          setTimeout(() => {
            const el = document.getElementById('comments-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }

        // B. Process pending reaction
        const pendingReactionStr = sessionStorage.getItem('pending_reaction');
        if (pendingReactionStr) {
          try {
            const pendingReaction = JSON.parse(pendingReactionStr);
            sessionStorage.removeItem('pending_reaction');
            
            // Execute the reaction
            await submitReaction(pendingReaction.commentId, pendingReaction.type, loggedInUser, fetchedComments);
            
            setMessage({ text: 'Welcome back! Your reaction has been submitted automatically.', type: 'success' });
            
            setTimeout(() => {
              const el = document.getElementById(`comment-${pendingReaction.commentId}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 600);
          } catch (err) {
            console.error('Failed to process pending reaction:', err);
          }
        }
      }
    };

    initAuthAndComments();
  }, [blogSlug]);

  // Fetch comments list from API
  const fetchComments = async (userEmail = '') => {
    setLoading(true);
    try {
      const emailQuery = userEmail ? `&userEmail=${encodeURIComponent(userEmail)}` : '';
      const response = await fetch(`/api/blog/comments?blogSlug=${encodeURIComponent(blogSlug)}${emailQuery}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        return data.comments || [];
      } else {
        console.error('Failed to load comments from API.');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
    return [];
  };

  // Submit a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    // Check if user is logged in
    if (!user || !user.email) {
      // Save comment content to session storage
      sessionStorage.setItem('pending_comment_text', newCommentText.trim());
      setPromptAction('comment');
      setShowPrompt(true);
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogSlug,
          authorName: user.name,
          authorEmail: user.email,
          authorRole: user.role,
          content: newCommentText.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setNewCommentText('');
        setMessage({ text: 'Comment posted successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to post comment. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Submit comment error:', error);
      setMessage({ text: 'Connection error. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Submit comment reaction to API
  const submitReaction = async (commentId, type, currentUser, currentComments = comments) => {
    setReactionLoadingId(commentId);
    try {
      const response = await fetch('/api/blog/comments/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          userEmail: currentUser.email,
          userRole: currentUser.role,
          reactionType: type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Toggle and recalculate reaction counts locally to reflect changes instantly
        setComments(() => {
          return currentComments.map((comment) => {
            if (comment.id === commentId) {
              let updatedLikes = comment.likes;
              let updatedDislikes = comment.dislikes;
              let updatedUserReaction = comment.userReaction;

              // Previous reaction state:
              if (comment.userReaction === type) {
                // Clicking the same button -> Toggle off
                if (type === 'like') updatedLikes = Math.max(0, updatedLikes - 1);
                if (type === 'dislike') updatedDislikes = Math.max(0, updatedDislikes - 1);
                updatedUserReaction = null;
              } else if (comment.userReaction && comment.userReaction !== type) {
                // Switching reactions -> Remove old one, add new one
                if (type === 'like') {
                  updatedLikes += 1;
                  updatedDislikes = Math.max(0, updatedDislikes - 1);
                } else {
                  updatedDislikes += 1;
                  updatedLikes = Math.max(0, updatedLikes - 1);
                }
                updatedUserReaction = type;
              } else {
                // New reaction -> Add reaction
                if (type === 'like') updatedLikes += 1;
                if (type === 'dislike') updatedDislikes += 1;
                updatedUserReaction = type;
              }

              return {
                ...comment,
                likes: updatedLikes,
                dislikes: updatedDislikes,
                userReaction: updatedUserReaction,
              };
            }
            return comment;
          });
        });
      } else {
        console.error('Reaction API error:', data.error);
      }
    } catch (error) {
      console.error('Reaction request error:', error);
    } finally {
      setReactionLoadingId(null);
    }
  };

  // Click handler for Likes/Dislikes
  const handleReactionClick = async (commentId, type) => {
    // If not logged in, trigger signup prompt redirect
    if (!user || !user.email) {
      sessionStorage.setItem('pending_reaction', JSON.stringify({ commentId, type }));
      setPromptAction('reaction');
      setShowPrompt(true);
      return;
    }

    await submitReaction(commentId, type, user);
  };

  // Navigates guest to Customer Portal `/login` to register
  const handleRegisterRedirect = () => {
    router.push(`/login?redirect=${encodeURIComponent(`/blog/${blogSlug}`)}`);
  };

  // Format creation date beautifully
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div id="comments-section" className="glass" style={{
      padding: '2.5rem',
      marginTop: '3rem',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .comment-textarea:focus {
          border-color: var(--primary-glow) !important;
          box-shadow: 0 0 12px var(--primary-light) !important;
          outline: none;
        }
        .reaction-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--foreground-muted);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .reaction-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--glass-border-hover);
          color: var(--foreground);
        }
        .reaction-btn.active-like {
          background: rgba(74, 222, 128, 0.12);
          border-color: rgba(74, 222, 128, 0.4);
          color: var(--success);
        }
        .reaction-btn.active-dislike {
          background: rgba(248, 113, 113, 0.12);
          border-color: rgba(248, 113, 113, 0.4);
          color: var(--error);
        }
        .floating-prompt {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          max-width: 360px;
          border: 1px solid var(--glass-border-hover);
          background: rgba(30, 25, 16, 0.95);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .user-initials {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
      `}} />

      <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span>💬</span> Comments ({comments.length})
      </h3>

      {message.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          background: message.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
          border: `1px solid ${message.type === 'success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`,
          color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
        }}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {/* New Comment Submission Form */}
      <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Author avatar node */}
          <div className="user-initials" style={{
            background: user ? (user.role === 'pro' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, var(--primary), #b45309)') : 'linear-gradient(135deg, #4b5563, #374151)',
            flexShrink: 0
          }}>
            {user ? user.name.slice(0, 1).toUpperCase() : '?'}
          </div>

          <div style={{ flex: 1 }}>
            <textarea
              className="comment-textarea"
              placeholder={user ? "Share your thoughts on this blog post..." : "Write a comment... (you will be prompted to register/login on submit)"}
              required
              rows={4}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'white',
                resize: 'vertical',
                transition: 'all 0.2s ease',
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                {user ? (
                  <span>Commenting as: <strong>{user.name}</strong> <span style={{ color: user.role === 'pro' ? '#60a5fa' : 'var(--primary)' }}>({user.role === 'pro' ? 'Verified Pro' : 'Customer'})</span></span>
                ) : (
                  <span style={{ color: 'var(--accent)' }}>⚠️ Register/Login required to submit comments.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting || !newCommentText.trim()}
                className="btn btn-primary"
                style={{
                  padding: '0.6rem 1.5rem',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  opacity: (!newCommentText.trim() || submitting) ? 0.6 : 1,
                  cursor: (!newCommentText.trim() || submitting) ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />

      {/* Comments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.7 }}>
          <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>⌛</span>
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.6, fontSize: '1.05rem', fontStyle: 'italic' }}>
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="flex flex-col gap-6" style={{ width: '100%' }}>
          {comments.map((comment) => {
            const initials = comment.author_name ? comment.author_name.slice(0, 1).toUpperCase() : 'U';
            const isPro = comment.author_role === 'pro';

            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className="glass"
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  transition: 'none' // Disable global hover transition deforming list layout
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Initials Avatar */}
                  <div className="user-initials" style={{
                    background: isPro ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, var(--primary), #b45309)',
                    flexShrink: 0
                  }}>
                    {initials}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Header: Name, Badge, Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '1.05rem' }}>{comment.author_name}</strong>
                        
                        {isPro ? (
                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#60a5fa',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            border: '1px solid rgba(59, 130, 246, 0.25)'
                          }}>
                            🛠️ Verified Pro
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(232, 145, 58, 0.15)',
                            color: 'var(--primary)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            border: '1px solid rgba(232, 145, 58, 0.25)'
                          }}>
                            👤 Customer
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{formatDate(comment.created_at)}</span>
                    </div>

                    {/* Content */}
                    <p style={{ marginTop: '0.75rem', fontSize: '1rem', opacity: 0.9, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {comment.content}
                    </p>

                    {/* Reactions Toolbar */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        disabled={reactionLoadingId === comment.id}
                        onClick={() => handleReactionClick(comment.id, 'like')}
                        className={`reaction-btn ${comment.userReaction === 'like' ? 'active-like' : ''}`}
                      >
                        <span>👍</span>
                        <span>{comment.likes || 0}</span>
                      </button>

                      <button
                        type="button"
                        disabled={reactionLoadingId === comment.id}
                        onClick={() => handleReactionClick(comment.id, 'dislike')}
                        className={`reaction-btn ${comment.userReaction === 'dislike' ? 'active-dislike' : ''}`}
                      >
                        <span>👎</span>
                        <span>{comment.dislikes || 0}</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Registration Prompt */}
      {showPrompt && (
        <div className="glass floating-prompt" style={{
          padding: '1.5rem',
          borderRadius: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent)' }}>🔒 Quick Registration</h4>
            <button
              onClick={() => setShowPrompt(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                opacity: 0.6,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          
          <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: '0 0 1.25rem 0', lineHeight: '1.5' }}>
            Registering takes only a couple of steps! Once registered as a customer, you can participate, submit comments, and react (like/dislike) directly on blogs.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowPrompt(false)}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              Dismiss
            </button>
            <button
              onClick={handleRegisterRedirect}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

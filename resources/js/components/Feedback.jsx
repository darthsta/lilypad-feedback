import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EMOJI_SCALE = ['🥲', '😕', '😐', '😊', '🤩'];
const API_BASE = '/api';

export default function FeedbackApp() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [form, setForm] = useState({ 
        customer_name: '', 
        message: '', 
        rating: 3 
    });
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Fetch feedback data
    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/feedback`, {
            params: filter ? { rating: filter } : {}
        })
            .then(res => {
                const data = res.data;
                setFeedbacks(Array.isArray(data) ? data : []);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
                setError('Failed to load feedback. Please try again.');
                setFeedbacks([]);
            })
            .finally(() => setLoading(false));
    }, [filter]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!form.customer_name.trim() || !form.message.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        axios.post(`${API_BASE}/feedback`, form)
            .then(() => {
                setForm(prev => ({
                    customer_name: '',
                    message: '',
                    rating: prev.rating
                }));
                setSubmitted(true);
                return axios.get(`${API_BASE}/feedback`);
            })
            .then(res => {
                setFeedbacks(res.data);
                setTimeout(() => setSubmitted(false), 3000);
            })
            .catch(error => {
                console.error('Submission error:', error.response?.data);
                setError(error.response?.data?.message || 'Submission failed. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { 
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    return (
      <div className="min-vh-100 bg-light p-4">
        <h1 className="text-center mb-5 display-5 text-dark">Customer Feedback Portal</h1>
        
        <div className="row g-4">
          {/* Left Panel - Form */}
          <div className="col-lg-6">
            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="h4 fw-bold mb-4 text-secondary">Submit Feedback</h2>
              
              {submitted && (
                <div className="alert alert-success mb-4">
                  Thank you for your feedback!
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}
    
              <form onSubmit={handleSubmit} className="vstack gap-3">
                <div>
                  <label htmlFor="customer_name" className="form-label fw-medium">Name *</label>
                  <input
                    id="customer_name"
                    type="text"
                    placeholder="Your name"
                    className="form-control p-3"
                    value={form.customer_name}
                    onChange={(e) => setForm({...form, customer_name: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
    
                <div>
                  <label htmlFor="message" className="form-label fw-medium">Message *</label>
                  <textarea
                    id="message"
                    placeholder="Your feedback message"
                    className="form-control p-3"
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
    
                <div>
                  <label className="form-label fw-medium">
                    How happy are you? <span className="fs-3">{EMOJI_SCALE[form.rating - 1]}</span>
                  </label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        aria-label={`Rating ${rating}`}
                        className={`btn p-2 fs-3 ${form.rating === rating ? 'bg-warning bg-opacity-25 scale-110' : 'bg-light'}`}
                        onClick={() => setForm({...form, rating})}
                        disabled={loading}
                        style={{
                          transform: form.rating === rating ? 'scale(1.1)' : 'scale(1)',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                      >
                        {EMOJI_SCALE[rating - 1]}
                      </button>
                    ))}
                  </div>
                </div>
    
                <button 
                  type="submit" 
                  className={`btn w-100 py-3 ${loading ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </span>
                  ) : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
    
          {/* Right Panel - Feedback List */}
          <div className="col-lg-6">
            <div className="bg-white p-4 rounded shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 fw-bold text-secondary">Recent Feedback</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="form-select w-auto"
                  disabled={loading}
                >
                  <option value="">All Ratings</option>
                  {[1, 2, 3, 4, 5].map(r => (
                    <option key={r} value={r}>{r} {EMOJI_SCALE[r - 1]}</option>
                  ))}
                </select>
              </div>
    
              {loading && feedbacks.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : feedbacks.length === 0 ? (
                <p className="text-muted py-4 text-center">No feedback yet. Be the first to submit!</p>
              ) : (
                <div className="overflow-auto pe-2" style={{maxHeight: '70vh'}}>
                  {feedbacks.map(feedback => (
                    <div key={feedback.id} className="p-3 mb-3 border rounded hover-shadow">
                      <div className="d-flex justify-content-between align-items-start">
                        <span className="fw-semibold text-dark">{feedback.customer_name}</span>
                        <span className="fs-3" title={`Rating: ${feedback.rating}`}>
                          {EMOJI_SCALE[feedback.rating - 1]}
                        </span>
                      </div>
                      <p className="mt-2 text-muted">{feedback.message}</p>
                      <div className="mt-2 small text-muted">
                        {formatDate(feedback.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
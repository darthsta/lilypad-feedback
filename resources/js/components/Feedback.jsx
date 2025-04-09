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
        axios.get(`${API_BASE}/feedback${filter ? `?rating=${filter}` : ''}`)
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
        <div className="min-h-screen bg-gray-50 p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Customer Feedback Portal</h1>
          
          {/* This is the key container for the side-by-side layout */}
          <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
            {/* Left Panel - Form (will be 50% width on large screens) */}
            <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Submit Feedback</h2>
              
              {submitted && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                  Thank you for your feedback!
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                  {error}
                </div>
              )}
      
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="customer_name" className="block mb-1 font-medium text-gray-700">Name *</label>
                  <input
                    id="customer_name"
                    type="text"
                    placeholder="Your name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.customer_name}
                    onChange={(e) => setForm({...form, customer_name: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
      
                <div>
                  <label htmlFor="message" className="block mb-1 font-medium text-gray-700">Message *</label>
                  <textarea
                    id="message"
                    placeholder="Your feedback message"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
      
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    How happy are you? <span className="text-2xl">{EMOJI_SCALE[form.rating - 1]}</span>
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        aria-label={`Rating ${rating}`}
                        className={`text-3xl p-2 rounded-full transition-all ${
                          form.rating === rating 
                            ? 'bg-yellow-100 scale-110 shadow-inner' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setForm({...form, rating})}
                        disabled={loading}
                      >
                        {EMOJI_SCALE[rating - 1]}
                      </button>
                    ))}
                  </div>
                </div>
      
                <button 
                  type="submit" 
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Feedback'}
                </button>
              </form>
            </div>
      
            {/* Right Panel - Feedback List (will be 50% width on large screens) */}
            <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Recent Feedback</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">All Ratings</option>
                  {[1, 2, 3, 4, 5].map(r => (
                    <option key={r} value={r}>{r} {EMOJI_SCALE[r - 1]}</option>
                  ))}
                </select>
              </div>
      
              {loading && feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : feedbacks.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">No feedback yet. Be the first to submit!</p>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {feedbacks.map(feedback => (
                    <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-800">{feedback.customer_name}</span>
                        <span className="text-2xl" title={`Rating: ${feedback.rating}`}>
                          {EMOJI_SCALE[feedback.rating - 1]}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{feedback.message}</p>
                      <div className="mt-3 text-sm text-gray-400">
                        {formatDate(feedback.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
}
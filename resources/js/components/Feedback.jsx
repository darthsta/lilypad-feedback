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

    // Fetch feedback data
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/feedback`)
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
    }, []);

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

        axios.post(`${API_BASE}/api/feedback`, form)
            .then(() => {
                // Reset form but keep the same rating
                setForm(prev => ({
                    customer_name: '',
                    message: '',
                    rating: prev.rating
                }));
                
                // Refresh the list from server
                return axios.get('/api/feedback');
            })
            .then(res => {
                setFeedbacks(res.data);
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
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="customer_name" className="block mb-1 font-medium">Name *</label>
                        <input
                            id="customer_name"
                            type="text"
                            placeholder="Your name"
                            className="w-full p-2 border rounded"
                            value={form.customer_name}
                            onChange={(e) => setForm({...form, customer_name: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block mb-1 font-medium">Message *</label>
                        <textarea
                            id="message"
                            placeholder="Your feedback message"
                            className="w-full p-2 border rounded"
                            rows="3"
                            value={form.message}
                            onChange={(e) => setForm({...form, message: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">How happy are you? {EMOJI_SCALE[form.rating - 1]}</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    aria-label={`Rating ${rating}`}
                                    className={`text-2xl p-2 rounded-full transition-colors ${
                                        form.rating === rating ? 'bg-yellow-100 ring-2 ring-yellow-300' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => setForm({...form, rating})}
                                >
                                    {EMOJI_SCALE[rating - 1]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`px-4 py-2 text-white rounded transition-colors ${
                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
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
                        ) : 'Submit'}
                    </button>
                </div>
            </form>

            {/* List Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Feedback</h2>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded bg-white"
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
                    <div className="space-y-3">
                        {feedbacks.map(feedback => (
                            <div key={feedback.id} className="p-4 border rounded-lg bg-white">
                                <div className="flex justify-between items-start">
                                    <span className="font-semibold">{feedback.customer_name}</span>
                                    <span className="text-xl" aria-label={`Rating ${feedback.rating}`}>
                                        {EMOJI_SCALE[feedback.rating - 1]}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-700">{feedback.message}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    {formatDate(feedback.created_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
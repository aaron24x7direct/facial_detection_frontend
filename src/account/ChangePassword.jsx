import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ChangePassword = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/accounts/change-password`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response) {
                alert('Your password has been changed successfully.');
            }
        } catch (err) {
            setError('Failed to update account details.');
            console.error(err);
        } finally {
            setLoading(false);
            setForm({
                old_password: '',
                new_password: '',
                confirm_new_password: '',
            })
        }
    };   
    
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <button
                    className="btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => navigate('/account')}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Account
                </button>
            </div>
            
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Change Password</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Old Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="old_password"
                                value={form.old_password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="new_password"
                                value={form.new_password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirm_new_password"
                                value={form.confirm_new_password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-success">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;

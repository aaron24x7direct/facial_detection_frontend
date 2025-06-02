import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        role_id: 1,
        fullname: '',
        section: '',
        username: '',
        email: '',
        phone_number: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(formData);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/authenticated/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Account creation failed');
            }

            alert('Account created successfully. You can now log in.');
            navigate('/');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Create Account</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullname"
                                        placeholder="Enter your full name"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Section</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="section"
                                        placeholder="Your section"
                                        value={formData.section}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone_number"
                                        placeholder="Enter your phone number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-select"
                                        name="role_id"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a role</option>
                                        <option value={1}>Student</option>
                                        <option value={2}>Professor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-success mt-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating account...
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-2"
                                    onClick={() => navigate('/')}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

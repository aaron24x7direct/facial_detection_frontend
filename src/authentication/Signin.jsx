import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/authenticated/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your email and password, then try again.');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            window.location.href = '/dashboard';
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Sign In</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button
                                    className="btn btn-primary mt-3"
                                    disabled={loading}
                                    >
                                    {loading ? (
                                        <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                                    <button className="btn btn-success mt-2" onClick={() => navigate('/create-account')}>Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Attendances = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const navigate = useNavigate();
    const navigate_path = location.pathname;
    const navigate_endpoint =
        navigate_path === '/my-attendances'
                ? '/my-attendances/graph'
                : navigate_path === '/overall-attendances' 
                ? '/overall-attendances/graph' 
                : '/section-attendances/graph';

    useEffect(() => {
        const fetchAttendances = async () => {
            const token = localStorage.getItem('token');
            const path = location.pathname;
            const endpoint =
                path === '/my-attendances'
                    ? '/facial_detections/me'
                    : path === 'overall-attendances'
                    ? '/facial_detections/'
                    : '/facial_detections'

            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}${endpoint}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log(response.data);
                setAttendances(response.data);

            } catch (err) {
                setError('Failed to load account details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendances();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="mb-4">
                <button
                    className="btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => navigate('/dashboard')}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Dashboard
                </button>
            </div>

            <h2 className="mb-4">{`${navigate_path === '/my-attendances' ? 'My Attendances' : navigate_path === '/overall-attendances' ? 'Overall Attendances' : 'Section Attendances'}`}</h2>
            <div className="mb-3">
                <button className="btn btn-primary" onClick={() => navigate(`${navigate_endpoint}`)}>Attendances Graph</button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Section</th>
                        <th>Subject Code</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map(attendance => (
                        <tr key={attendance.id}>
                            <td>{attendance.id}</td>
                            <td>{attendance.user.fullname}</td>
                            <td>{attendance.user.username}</td>
                            <td>{attendance.user.email}</td>
                            <td>{attendance.user.phone_number}</td>
                            <td>{attendance.status}</td>
                            <td>{attendance.subject.section}</td>
                            <td>{attendance.subject.subject_code}</td>
                            <td>{new Date(attendance.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendances;

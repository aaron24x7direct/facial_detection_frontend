import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const SectionAttendances = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const navigate_path = location.pathname;
    const navigate_endpoint = '/section-attendances/graph';

    useEffect(() => {
        const fetchAttendances = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/facial_detections/section`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setData(response.data);
            } catch (err) {
                setError('Failed to load attendance data.');
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

            <h2 className="mb-4">Section Attendances</h2>
            <div className="mb-3">
                <button className="btn btn-primary" onClick={() => navigate(navigate_endpoint)}>
                    Attendances Graph
                </button>
            </div>

            {Object.entries(data).map(([section, subjects]) => (
                <div key={section} className="mb-5">
                    <h4 className="text-primary border-bottom pb-2">{section}</h4>
                    {Object.entries(subjects).map(([subjectCode, records]) => (
                        <div key={subjectCode} className="mb-4">
                            <h5 className="text-secondary">{subjectCode}</h5>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Full Name</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((record) => (
                                            <tr key={record.id}>
                                                <td>{record.id}</td>
                                                <td>{record.user.fullname}</td>
                                                <td>{record.user.username}</td>
                                                <td>{record.user.email}</td>
                                                <td>{record.user.phone_number}</td>
                                                <td>{record.status}</td>
                                                <td>{new Date(record.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SectionAttendances;

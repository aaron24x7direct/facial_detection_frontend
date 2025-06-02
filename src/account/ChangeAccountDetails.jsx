import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ChangeAccountDetails = () => {
    const navigate = useNavigate();
    const [accountDetail, setAccountDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        fullname: '',
        email: '',
        phone_number: '',
        username: ''
    });

    useEffect(() => {
        const fetchAccountDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/accounts/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAccountDetail(response.data);
                setForm({
                    fullname: response.data.fullname || '',
                    email: response.data.email || '',
                    phone_number: response.data.phone_number || '',
                    username: response.data.username || ''
                });
            } catch (err) {
                setError('Failed to load account details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, []);

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
                `${import.meta.env.VITE_API_URL}/accounts/change-account-details`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if(response){
                alert('Your account details have been updated successfully.');
            }
        } catch (err) {
            setError('Failed to update account details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    return (
        <div className="container mt-5 mb-5">
            <div className="mb-4">
                <button
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => navigate('/account')}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Account
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Change Account Details</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="fullname"
                                    value={form.fullname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone_number"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-end">
                            <button type="submit" className="btn btn-success px-4">
                                Save Changes
                            </button>
                        </div>
                    </form>

                    {/* 🔧 START: Student Info & Subjects Table */}
                    {accountDetail?.student_infos?.length > 0 && (
                        <div className="mt-5">
                            <h5 className="text-primary mb-3">Student Information</h5>
                            <table className="table table-bordered table-striped">
                                <tbody>
                                    <tr>
                                        <th>Student Number</th>
                                        <td>{accountDetail.student_infos[0].student_number}</td>
                                    </tr>
                                    <tr>
                                        <th>LRN</th>
                                        <td>{accountDetail.student_infos[0].lrn}</td>
                                    </tr>
                                    <tr>
                                        <th>Sex</th>
                                        <td>{accountDetail.student_infos[0].sex}</td>
                                    </tr>
                                    <tr>
                                        <th>Course</th>
                                        <td>{accountDetail.student_infos[0].course}</td>
                                    </tr>
                                    <tr>
                                        <th>Academic Year</th>
                                        <td>{accountDetail.student_infos[0].academic_year}</td>
                                    </tr>
                                    <tr>
                                        <th>Academic Term</th>
                                        <td>{accountDetail.student_infos[0].academic_term}</td>
                                    </tr>
                                    <tr>
                                        <th>Campus</th>
                                        <td>{accountDetail.student_infos[0].campus}</td>
                                    </tr>
                                    <tr>
                                        <th>Year Status</th>
                                        <td>{accountDetail.student_infos[0].year_status}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {accountDetail.student_infos[0].subjects?.length > 0 && (
                                <>
                                    <h6 className="text-secondary mt-4">Subjects</h6>
                                    <div className="table-responsive">
                                        <table className="table table-hover table-bordered align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Subject Code</th>
                                                    <th>Days</th>
                                                    <th>Time</th>
                                                    <th>Section</th>
                                                    <th>Room</th>
                                                    <th>Lec Units</th>
                                                    <th>Lab Units</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {accountDetail.student_infos[0].subjects.map(subject => (
                                                    <tr key={subject.id}>
                                                        <td>{subject.subject_code}</td>
                                                        <td>{subject.days}</td>
                                                        <td>{subject.time}</td>
                                                        <td>{subject.section}</td>
                                                        <td>{subject.room}</td>
                                                        <td>{subject.lec_units}</td>
                                                        <td>{subject.lab_units}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {/* 🔧 END: Student Info & Subjects Table */}
                </div>
            </div>
        </div>
    );
};

export default ChangeAccountDetails;

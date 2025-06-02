import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserEdit, FaKey, FaCamera } from 'react-icons/fa';

const Account = () => {
    const navigate = useNavigate();

    const Card = ({ icon, title, onClick }) => (
        <div
            className="col-md-6 mb-4"
            role="button"
            onClick={onClick}
        >
            <div className="card h-100 shadow-sm border-0 hover-shadow transition" style={{ cursor: 'pointer' }}>
                <div className="card-body d-flex align-items-center">
                    <div className="me-3 text-primary fs-3">{icon}</div>
                    <h5 className="card-title mb-0">{title}</h5>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <button
                    className="btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => navigate('/dashboard')}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Dashboard
                </button>
            </div>

            <div className="text-center mb-5">
                <h2 className="text-primary">Account Settings</h2>
                <p className="text-muted">Manage your profile and security</p>
            </div>

            <div className="row">
                <Card
                    icon={<FaUserEdit />}
                    title="Change Account Details"
                    onClick={() => navigate('/account/change-details')}
                />
                <Card
                    icon={<FaKey />}
                    title="Change Password"
                    onClick={() => navigate('/account/change-password')}
                />
                <Card
                    icon={<FaCamera />}
                    title="Facial Detection User Images"
                    onClick={() => navigate('/account/facial-detection-user-images')}
                />
            </div>
        </div>
    );
};

export default Account;

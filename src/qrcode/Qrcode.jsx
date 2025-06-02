import React from 'react';
import { jwtDecode } from 'jwt-decode';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Qrcode = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (!token) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning">No token found</div>
            </div>
        );
    }

    let decoded;
    try {
        decoded = jwtDecode(token);
    } catch (e) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">Invalid token</div>
            </div>
        );
    }

    const value = decoded?.sub || 'No sub in token';

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
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h4 className="text-primary mb-3">QR Code for: {decoded.fullname}</h4>
                            <div className="d-flex justify-content-center mb-3">
                                <QRCode value={value} size={180} bgColor="#fff" fgColor="#0d6efd" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Qrcode;

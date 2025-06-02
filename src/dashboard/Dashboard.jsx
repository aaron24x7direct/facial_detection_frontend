import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaCalendarCheck, FaChartBar, FaQrcode } from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    console.log(decoded);

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
            <div className="text-center mb-5">
                <h2 className="text-primary">Welcome, {decoded.fullname} ({decoded.role}) </h2>
                <p className="text-muted">Choose an option below</p>
            </div>
            <div className="row">
                <Card
                    icon={<FaSignOutAlt />}
                    title="Logout"
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                    }}
                />
                <Card
                    icon={<FaUser />}
                    title="Account"
                    onClick={() => navigate('/account')}
                />
                {decoded.role != "Student" && 
                    <>
                        <Card
                            icon={<FaChartBar />}
                            title="Section Attendances"
                            onClick={() => navigate('/section-attendances')}
                        />
                        <Card
                            icon={<FaChartBar />}
                            title="Overall Attendances"
                            onClick={() => navigate('/overall-attendances')}
                        />
                    </>
                }
                {decoded.role != "Professor" && 
                    <>
                        <Card
                            icon={<FaCalendarCheck />}
                            title="My Attendances"
                            onClick={() => {
                                navigate('/my-attendances');
                            }}
                        />
                        <Card
                            icon={<FaQrcode />}
                            title="QR Code"
                            onClick={() => navigate('/qrcode')}
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default Dashboard;

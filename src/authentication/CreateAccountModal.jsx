import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountModal = ({ show, isClose, orfData }) => {
    if (!show || !orfData) return null;

    const { fields, subjects, filename } = orfData;
    console.log(orfData);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        const payload = {
            email,
            password,
            student_infos: {
              fullname: fields["Full Name"] || "",
              student_number: fields["Student Number"] || "",
              lrn: fields["LRN"] || "",
              sex: fields["Sex"] || "",
              course: fields["Course"] || "",
              year_status: fields["Year/Status"] || "",
              academic_term: fields["Academic Term"] || "",
              academic_year: fields["Academic Year"] || "",
              campus: fields["Campus"] || "",
              contact: fields["Contact #"] || "",
              home_address: fields["Home Address"] || "",
              major: fields["Major"] || ""
            },
            subjects: subjects.map((subject) => ({
              subject_code: subject["Subject Code"] || "",
              section: subject["Section"] || "",
              lec_units: subject["Lec Units"] || 0,
              lab_units: subject["Lab Units"] || 0,
              days: subject["Days"] || "",
              time: subject["Time"] || "",
              room: subject["Room"] || ""
            }))
        };          

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/authenticated/create-account-with-orf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
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

    // const handleCreateAccount = () => {
    //     if (!email || !password) {
    //         alert("Please fill in both email and password.");
    //         return;
    //     }

    //     console.log({
    //         email,
    //         password,
    //         student_infos: fields,
    //         subjects: subjects
    //     });

    //     isClose();
    // };

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Create Student Account</h5>
                        <button className="btn-close btn-close-white" onClick={isClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        {/* Student Info */}
                        <h6 className="fw-bold mb-3">📋 Student Information</h6>
                        <div className="row g-3 mb-4">
                            {Object.entries(fields).map(([key, value]) => (
                                <div className="col-md-4" key={key}>
                                    <div className="border rounded p-2 h-100 bg-light">
                                        <strong>{key}:</strong>
                                        <div>{value || <em className="text-muted">N/A</em>}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subjects */}
                        <h6 className="fw-bold mb-3">📚 Enrolled Subjects</h6>
                        <div className="table-responsive mb-4">
                            <table className="table table-striped table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Subject Code</th>
                                        <th>Section</th>
                                        <th>Lec Units</th>
                                        <th>Lab Units</th>
                                        <th>Days</th>
                                        <th>Time</th>
                                        <th>Room</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subj, index) => (
                                        <tr key={index}>
                                            <td>{subj["Subject Code"]}</td>
                                            <td>{subj.Section}</td>
                                            <td>{subj["Lec Units"]}</td>
                                            <td>{subj["Lab Units"]}</td>
                                            <td>{subj.Days}</td>
                                            <td>{subj.Time}</td>
                                            <td>{subj.Room || <em>N/A</em>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Account Info Inputs */}
                        <h6 className="fw-bold mb-3">📝 Account Credentials</h6>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        {/* PDF Link */}
                        <div className="mb-3">
                            <strong>📎 PDF Filename:</strong> {filename}
                        </div>
                        <div className="alert alert-info">
                            📄 For full fee details and payment schedule, please refer to the PDF document or registrar.
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={isClose}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={handleCreateAccount}
                            disabled={loading}
                            >
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAccountModal;

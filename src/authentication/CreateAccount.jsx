import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateAccountModal from './CreateAccountModal';

const CreateAccount = () => {
    const [orf, setOrf] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orfData, setOrfData] = useState(null);
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setOrf(null);
                e.target.value = ''; // clear input
            } else {
                setError(null);
                setOrf(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!orf) {
            setError('Please select a valid PDF file.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', orf);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/authenticated/upload-pdf`,
                formData
            );

            setOrfData(response.data);
            setShowCreateAccountModal(true);
        } catch (err) {
            setError('Failed to upload PDF.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card p-4 shadow">
                            <h2 className="text-center mb-4">Create Account</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label className="form-label">ORF (PDF only):</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="orf"
                                            accept=".pdf"
                                            onChange={handleChange}
                                            required
                                        />
                                        {error && (
                                            <div className="text-danger mt-2">{error}</div>
                                        )}
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
            <CreateAccountModal 
                orfData={orfData}
                show={showCreateAccountModal}    
                isClose={() => setShowCreateAccountModal(false)}
            />
        </>
    );
};

export default CreateAccount;

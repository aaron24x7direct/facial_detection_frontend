import React, { useState, useEffect } from 'react';
import avatar from '../assets/avatar.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const FacialDetectionUserImages = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(avatar);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchFacialDetectionUserImages = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/facial_detection_user_images`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setImages(response.data);

            } catch (err) {
                setError('Failed to load account details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacialDetectionUserImages();
    }, [images]);

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile || null);

        if (selectedFile) {
            const previewURL = URL.createObjectURL(selectedFile);
            setPreview(previewURL);
        } else {
            setPreview(avatar);
        }
    };

    const handleDelete = async (imageId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }
    
        const confirmDelete = window.confirm('Are you sure you want to delete this image?');
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/facial_detection_user_images/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        } catch (error) {
            console.error('Failed to delete image:', error);
            setError('Failed to delete image. Please try again.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!file) {
            setError('Please select an image.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/facial_detection_user_images/upload-image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
        } catch (err) {
            setError('Failed to upload image.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <button
                    className="btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => navigate('/account')}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Account
                </button>
            </div>
            
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Facial Detection User Image</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {images.map((image, index) => (
                                <div className="col-md-3 col-sm-4 col-6 mb-4" key={index}>
                                    <div className="card shadow-sm border-0">
                                        <div className="position-relative">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}/${image.image_path}`}
                                                alt={`Preview ${index}`}
                                                className="card-img-top rounded-top"
                                                style={{ height: '180px', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                onClick={() => handleDelete(image.id)}
                                                title="Delete"
                                                style={{ borderRadius: '50%' }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="card-body p-2 text-center">
                                            <small className="text-muted">Image #{index + 1}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleChange}
                                accept="image/*"
                            />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? 'Uploading...' : 'Save Image'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacialDetectionUserImages;

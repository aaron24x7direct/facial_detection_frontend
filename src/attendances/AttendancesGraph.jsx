import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { subDays, subMonths, subYears, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';

const AttendancesGraph = () => {
    const [range, setRange] = useState('1m');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);
    const navigate = useNavigate();
    const navigate_path = location.pathname;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const path = location.pathname;
                const endpoint =
                    path === '/my-attendances/graph'
                        ? '/facial_detections/graph/me'
                        : path === '/overall-attendances/graph'
                        ? '/facial_detections/graph'
                        : '/facial_detections/graph';

                const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(response.data);
            } catch (err) {
                setError('Failed to load graph data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterByRange = () => {
        const now = new Date();
        let start;
        if (range === '1w') start = subDays(now, 7);
        else if (range === '1m') start = subMonths(now, 1);
        else if (range === '1y') start = subYears(now, 1);
        else start = new Date(0);

        return data.filter((item) => isAfter(new Date(item.date), start));
    };

    const filtered = filterByRange();

    const exportToExcel = async () => {
        try {
            const chartNode = chartRef.current;
            const dataUrl = await htmlToImage.toPng(chartNode);
            const imageBlob = await (await fetch(dataUrl)).blob();
            const arrayBuffer = await imageBlob.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            const dataSheet = workbook.addWorksheet('Attendances');
            const graphSheet = workbook.addWorksheet('Graph');

            // ✅ UPDATED: Include Late and Present columns
            dataSheet.columns = [
                { header: 'Date', key: 'date', width: 20 },
                { header: 'Late', key: 'Late', width: 10 },
                { header: 'Present', key: 'Present', width: 10 },
            ];
            dataSheet.addRows(
                filtered.map(item => ({
                    date: item.date,
                    Late: item.Late ?? 0,
                    Present: item.Present ?? 0,
                }))
            );

            const imageId = workbook.addImage({
                buffer: arrayBuffer,
                extension: 'png',
            });
            graphSheet.addImage(imageId, {
                tl: { col: 0, row: 1 },
                ext: { width: 600, height: 400 },
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'attendances_with_graph.xlsx');
        } catch (error) {
            console.error('Excel export failed:', error);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="mb-4">
                <button
                    className="btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <h2 className="mb-4">
                {`${navigate_path === '/my-attendances/graph' ? 'My Attendances Graph' : navigate_path === '/overall-attendances/graph' ? 'Overall Attendances Graph' : 'Section Attendances Graph'}`}
            </h2>

            <div className="mb-3 d-flex align-items-center">
                <div className="me-3">
                    <button className={`btn btn-sm me-2 ${range === '1w' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRange('1w')}>1 Week</button>
                    <button className={`btn btn-sm me-2 ${range === '1m' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRange('1m')}>1 Month</button>
                    <button className={`btn btn-sm me-3 ${range === '1y' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRange('1y')}>1 Year</button>
                </div>
                <button className="btn btn-success btn-sm" onClick={exportToExcel}>Export to Excel</button>
            </div>

            <div ref={chartRef} style={{ background: '#fff', padding: '1rem' }}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filtered}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        {/* ✅ UPDATED: Show both Late and Present lines */}
                        <Line type="monotone" dataKey="Late" stroke="#ff4d4f" name="Late" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Present" stroke="#52c41a" name="Present" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AttendancesGraph;

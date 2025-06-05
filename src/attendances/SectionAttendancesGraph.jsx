import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { subDays, subMonths, subYears, isAfter } from 'date-fns';
import { FaArrowLeft } from 'react-icons/fa';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';

const SectionAttendancesGraph = () => {
  const [range, setRange] = useState('1m');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({}); // separate refs for each section

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/facial_detections/graph/section`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Filter data by date range per section
  const filterByRange = (sectionData) => {
    const now = new Date();
    let start;
    if (range === '1w') start = subDays(now, 7);
    else if (range === '1m') start = subMonths(now, 1);
    else if (range === '1y') start = subYears(now, 1);
    else start = new Date(0);

    return sectionData.filter(item => isAfter(new Date(item.date), start));
  };

  // Export all charts and data to Excel
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();

      for (const [section, sectionData] of Object.entries(data)) {
        // Add worksheet per section
        const sheet = workbook.addWorksheet(section);

        // Columns
        sheet.columns = [
          { header: 'Date', key: 'date', width: 15 },
          { header: 'Late', key: 'Late', width: 10 },
          { header: 'Present', key: 'Present', width: 10 },
        ];

        // Add filtered rows
        filterByRange(sectionData).forEach(row => {
          sheet.addRow(row);
        });

        // Add chart image if ref exists
        const chartNode = chartRefs.current[section];
        if (chartNode) {
          const dataUrl = await htmlToImage.toPng(chartNode);
          const imageBlob = await (await fetch(dataUrl)).blob();
          const arrayBuffer = await imageBlob.arrayBuffer();
          const imageId = workbook.addImage({
            buffer: arrayBuffer,
            extension: 'png',
          });
          sheet.addImage(imageId, {
            tl: { col: 4, row: 1 },
            ext: { width: 500, height: 300 },
          });
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'section_attendances_graphs.xlsx');
    } catch (error) {
      console.error('Excel export failed:', error);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-link d-flex align-items-center mb-4"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="me-2" /> Back
      </button>

      <h2 className="mb-4">Section Attendances Graph</h2>

      <div className="mb-3 d-flex align-items-center">
        <div className="me-3">
          <button
            className={`btn btn-sm me-2 ${range === '1w' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setRange('1w')}
          >
            1 Week
          </button>
          <button
            className={`btn btn-sm me-2 ${range === '1m' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setRange('1m')}
          >
            1 Month
          </button>
          <button
            className={`btn btn-sm me-3 ${range === '1y' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setRange('1y')}
          >
            1 Year
          </button>
        </div>
        <button className="btn btn-success btn-sm" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {Object.entries(data).map(([section, sectionData]) => {
        const filteredData = filterByRange(sectionData);

        if (filteredData.length === 0) return null; // skip empty

        return (
          <div key={section} className="mb-5">
            <h4>{section}</h4>
            <div
              ref={(el) => (chartRefs.current[section] = el)}
              style={{ background: '#fff', padding: '1rem', borderRadius: '4px' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Late" stroke="#ff4d4f" name="Late" activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Present" stroke="#52c41a" name="Present" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionAttendancesGraph;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    axios
      .get('http://localhost:5000/api/auth/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessage(res.data.msg);
        setUserId(res.data.userId);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Access denied. Please login.');
      });
  }, []);

  return (
    <>
      <style>{`
        .dashboard-container {
          padding: 50px 20px;
          background: linear-gradient(to right, #e0f7fa, #fce4ec);
          min-height: 72vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .dashboard-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .dashboard-subtitle {
          text-align: center;
          font-size: 18px;
          color: #555;
          margin-bottom: 30px;
        }

        .user-id {
          text-align: center;
          font-size: 14px;
          color: #666;
          margin-bottom: 40px;
        }

        .card-container {
          display: flex;
          justify-content: center;
          align-items: stretch;
          flex-wrap: wrap;
          gap: 30px;
        }

        .dashboard-card {
          flex: 1;
          min-width: 250px;
          max-width: 300px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .dashboard-card img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }

        .dashboard-card:hover img {
          transform: scale(1.1);
        }

        .dashboard-card h3 {
          font-size: 22px;
          margin-bottom: 10px;
          color: #333;
        }

        .dashboard-card p {
          font-size: 15px;
          color: #555;
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 28px;
          }

          .dashboard-card {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard</h2>
        <h3 className="dashboard-subtitle">{message}</h3>
        {userId && <p className="user-id">User ID: {userId}</p>}

        <div className="card-container">
          <div
            className="dashboard-card"
            style={{ backgroundColor: '#e8f5e9' }}
            onClick={() => navigate('/billing')}
          >
            <img src="/billing-image.jpg" alt="Billing" />
            <h3>Billing</h3>
            <p>Manage and generate invoices</p>
          </div>

          <div
            className="dashboard-card"
            style={{ backgroundColor: '#e3f2fd' }}
            onClick={() => navigate('/products')}
          >
            <img src="/product-image.png" alt="Products" />
            <h3>Products</h3>
            <p>View and edit product listings</p>
          </div>

          <div
            className="dashboard-card"
            style={{ backgroundColor: '#fce4ec' }}
            onClick={() => navigate('/customers')}
          >
            <img src="/customer-image.png" alt="Customers" />
            <h3>Customers</h3>
            <p>Manage customer information</p>
          </div>

          <div
            className="dashboard-card"
            style={{ backgroundColor: '#f5f5dc' }}
            onClick={() => navigate('/bills')}
          >
            <img src="/bills-image.png" alt="Bills List" />
            <h3>Bills List</h3>
            <p>View all customer bills</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

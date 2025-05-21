import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BillsList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/billing/all');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this bill?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/billing/delete/${id}`);
      setBills((prevBills) => prevBills.filter((bill) => bill._id !== id));
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  if (loading) return <p style={styles.loading}>Loading bills...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Bills</h2>
      {bills.length === 0 ? (
        <p style={styles.noData}>No bills found.</p>
      ) : (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={bill._id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>{bill.customer.name}</td>
                <td style={styles.td}>{bill.customer.phone}</td>
                <td style={styles.td}>₹{bill.totals.totalWithGST.toFixed(2)}</td>
                <td style={styles.td}>
                  <button style={styles.deleteButton} onClick={() => handleDelete(bill._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '40px auto',
    marginTop: '2vh',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '16px',
  },
  thead: {
    backgroundColor: '#4a90e2',
  },
  th: {
    color: '#fff',
    padding: '14px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid #e0e0e0',
    color: '#333',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '40px',
  },
  noData: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#FFCCCC',
    color: 'black',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BillsList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get('http://localhost:5000/api/customers/all');
    setCustomers(res.data);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const customerData = { name, mobile, email, address };

    if (editingId) {
      await axios.put(`http://localhost:5000/api/customers/update/${editingId}`, customerData);
    } else {
      await axios.post('http://localhost:5000/api/customers/add', customerData);
    }

    resetForm();
    fetchCustomers();
  };

  const resetForm = () => {
    setName('');
    setMobile('');
    setEmail('');
    setAddress('');
    setEditingId(null);
  };

  const handleEdit = (customer) => {
    setName(customer.name);
    setMobile(customer.mobile);
    setEmail(customer.email);
    setAddress(customer.address || '');
    setEditingId(customer._id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this customer?');
    if (!confirm) return;

    try{
    await axios.delete(`http://localhost:5000/api/customers/delete/${id}`);
    fetchCustomers();
    }catch (error) {
      console.error('Error deleting Customer:', error);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  const styles = {
    customerPage: {
      fontFamily: 'Arial, sans-serif',
      padding: '30px',
      backgroundColor: '#f9f9f9',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    searchInput: {
      padding: '10px',
      width: '250px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    customerForm: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '20px',
    },
    formInput: {
      padding: '10px',
      width: '250px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    submitBtn: {
      padding: '10px 20px',
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    cancelBtn: {
      padding: '10px 20px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    customerTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    tableHeader: {
      backgroundColor: '#4a90e2',
      color: 'white',
    },
    tableCell: {
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    tableRowEven: {
      backgroundColor: '#f2f2f2',
    },
    tableRowHover: {
      backgroundColor: '#eaeaea',
    },
    editBtn: {
      padding: '5px 10px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      backgroundColor: '#FFFFE0',
      color: 'black',
      marginRight: '10px',
    },
    deleteBtn: {
      padding: '5px 10px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      backgroundColor: '#FFCCCC',
      color: 'black',
    },
    noCustomers: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#888',
    },
  };

  return (
    <div style={styles.customerPage}>
      <div style={styles.header}>
        <h2>Customers</h2>
        <input
          style={styles.searchInput}
          placeholder="Search by name or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleAddOrUpdate} style={styles.customerForm}>
        <input
          style={styles.formInput}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.formInput}
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <input
          style={styles.formInput}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.formInput}
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit" style={styles.submitBtn}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </form>

      <table style={styles.customerTable}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableCell}>Name</th>
            <th style={styles.tableCell}>Mobile</th>
            <th style={styles.tableCell}>Email</th>
            <th style={styles.tableCell}>Address</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noCustomers}>
                No customers found
              </td>
            </tr>
          ) : (
            filteredCustomers.map((cust) => (
              <tr
                key={cust._id}
                style={{ ...styles.tableCell, ...(cust._id % 2 === 0 ? styles.tableRowEven : {}) }}
              >
                <td style={styles.tableCell}>{cust.name}</td>
                <td style={styles.tableCell}>{cust.mobile}</td>
                <td style={styles.tableCell}>{cust.email}</td>
                <td style={styles.tableCell}>{cust.address}</td>
                <td style={styles.tableCell}>
                  <button style={styles.editBtn} onClick={() => handleEdit(cust)}>
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(cust._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerPage;

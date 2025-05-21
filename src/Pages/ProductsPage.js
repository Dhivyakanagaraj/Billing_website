import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/all');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const productData = { name, price, description };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/update/${editingId}`, productData);
        setMessage('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products/add', productData);
        setMessage('Product added successfully!');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage('Error saving product');
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || '');
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {

    const confirm = window.confirm('Are you sure you want to delete this Product?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
      setMessage('Product deleted');
      fetchProducts();
    } catch (err) {
      setMessage('Error deleting product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.price.toString().includes(search)
  );

  const styles = {
    page: {
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
    productForm: {
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
    productTable: {
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
    noProducts: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#888',
    },
    message: {
      marginBottom: '20px',
      fontWeight: '500',
      color: '#4caf50',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Products</h2>
        <input
          style={styles.searchInput}
          placeholder="Search by name or price"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleAddOrUpdateProduct} style={styles.productForm}>
        <input
          style={styles.formInput}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.formInput}
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          style={styles.formInput}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

      {message && <p style={styles.message}>{message}</p>}

      <table style={styles.productTable}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableCell}>Name</th>
            <th style={styles.tableCell}>Price</th>
            <th style={styles.tableCell}>Description</th>
            <th style={styles.tableCell}>Last Updated</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noProducts}>
                No products found
              </td>
            </tr>
          ) : (
            filteredProducts.map((prod, index) => (
              <tr
                key={prod._id}
                style={{ ...styles.tableCell, ...(index % 2 === 0 ? styles.tableRowEven : {}) }}
              >
                <td style={styles.tableCell}>{prod.name}</td>
                <td style={styles.tableCell}>{prod.price}</td>
                <td style={styles.tableCell}>{prod.description || '-'}</td>
                <td style={styles.tableCell}>
                {new Date(prod.updatedAt).toLocaleString()}
                </td>
                <td style={styles.tableCell}>
                  <button style={styles.editBtn} onClick={() => handleEdit(prod)}>
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(prod._id)}
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

export default ProductsPage;

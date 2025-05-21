import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';

function BillingPage() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [gst, setGst] = useState(18);
  const [error, setError] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://localhost:5000/api/products/all');
        setAllProducts(productsRes.data);
      } catch (err) {
        console.error('Error fetching product/customer list', err);
      }
    };
  
    fetchData();
  }, []);
  


  const handleMobileChange = async (e) => {
    const mobile = e.target.value;
    setCustomerPhone(mobile);

    // Auto-fetch only when 10 digits are entered
    if (mobile.length === 10) {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${mobile}`);
        const customer = res.data;

        if (customer) {
          setCustomerName(customer.name);
          setCustomerEmail(customer.email);
          setCustomerAddress(customer.address);
        } else {
          setCustomerName('');
          setCustomerEmail('');
          setCustomerAddress('');
        }
      } catch (err) {
        console.error('Error fetching customer:', err);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerAddress('');
      }
    }
  };

  useEffect(() => {
    const fetchProductPrice = async () => {
      if (productName.trim() === '') return;

      try {
        const res = await axios.get(`http://localhost:5000/api/products/get/${productName}`);
        if (res.data) {
          setPrice(Number(res.data.price));
        }
      } catch (err) {
        console.error('Product not found or error fetching price');
        setPrice(0);
      }
    };

    fetchProductPrice();
  }, [productName]);

  const handleAddProduct = () => {
    if (!productName || quantity <= 0 || price <= 0) {
      setError('Please fill all product fields correctly.');
      return;
    }

    const newProduct = {
      name: productName,
      quantity,
      price,
      total: quantity * price,
      gstAmount: (quantity * price * gst) / 100,
      totalWithGST: (quantity * price) + ((quantity * price * gst) / 100),
    };

    setProducts([...products, newProduct]);
    setProductName('');
    setQuantity(1);
    setPrice(0);
    setError('');
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;
    let totalWithGST = 0;

    products.forEach(product => {
      subtotal += product.total;
      totalGST += product.gstAmount;
      totalWithGST += product.totalWithGST;
    });

    return { subtotal, totalGST, totalWithGST };
  };

  const generatePDF = async () => {
    if (!customerName || !customerAddress || !customerPhone) {
      alert('Please fill all required customer details.');
      return;
    }

    const { subtotal, totalGST, totalWithGST } = calculateTotals();

    const invoiceData = {
      shop: {
        name: 'RAKESH GLASS & PLYWOOD',
        address: '28-C, Nandhini Complex, Kovai Road, Kangayam - 638701, Tiruppur Dist',
        phone: '99521 79391',
        gstin: '33ASAPB0355R1ZV',
      },
      customer: {
        name: customerName,
        address: customerAddress,
        phone: customerPhone,
        email: customerEmail || null,
      },
      products,
      totals: {
        subtotal,
        totalGST,
        totalWithGST
      }
    };

    try {
      await axios.post('http://localhost:5000/api/billing/create', invoiceData);
      console.log('Invoice saved to DB');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    let y = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceData.shop.name, 105, y, { align: 'center' });
    y += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.shop.address, 105, y, { align: 'center' });
    y += 5;
    doc.text(`Phone: ${invoiceData.shop.phone}`, 105, y, { align: 'center' });
    y += 5;
    doc.text(`GSTIN: ${invoiceData.shop.gstin}`, 105, y, { align: 'center' });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TAX INVOICE', 105, y, { align: 'center' });

    y += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${invoiceData.customer.name}`, margin, y);
    y += 5;
    doc.text(`Address: ${invoiceData.customer.address}`, margin, y);
    y += 5;
    doc.text(`Phone: ${invoiceData.customer.phone}`, margin, y);
    if (invoiceData.customer.email) {
      y += 5;
      doc.text(`Email: ${invoiceData.customer.email}`, margin, y);
    }

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Products', margin, y);
    y += 6;

    // Table Headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('S.No', margin, y);
    doc.text('Product', margin + 15, y);
    doc.text('Qty', margin + 63, y);
    doc.text('Price', margin + 85, y);
    doc.text('Total', margin + 110, y);
    doc.text('GST', margin + 135, y);
    doc.text('Total w/ GST', margin + 155, y);

    y += 4;
    doc.setLineWidth(0.1);
    doc.line(margin, y, 200 - margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');

    products.forEach((p, index) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      doc.text(String(index + 1), margin, y);
      doc.text(p.name, margin + 15, y);
      doc.text(String(p.quantity), margin + 65, y);
      doc.text(`₹${Number(p.price).toFixed(2)}`, margin + 80, y);
      doc.text(`₹${Number(p.total).toFixed(2)}`, margin + 105, y);
      doc.text(`₹${Number(p.gstAmount).toFixed(2)}`, margin + 130, y);
      doc.text(`₹${Number(p.totalWithGST).toFixed(2)}`, margin + 155, y); // aligned with header
      y += 6;
    });

    y += 6;
    doc.setLineWidth(0.5);
    doc.line(margin, y, 200 - margin, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, margin, y);
    y += 6;
    doc.text(`GST Total: ₹${totalGST.toFixed(2)}`, margin, y);
    y += 6;
    doc.text(`Total Amount: ₹${totalWithGST.toFixed(2)}`, margin, y);

    y += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', 105, y, { align: 'center' });

    doc.save('invoice.pdf');
  };

  return (
    <div style={styles.container}>
      <h2>Billing System</h2>

      <div style={styles.form}>
        <h3>Customer Details</h3>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name *</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Address *</label>
            <input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone *</label>
            <input type="text" value={customerPhone} onChange={handleMobileChange} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email (optional)</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={styles.input} />
          </div>
        </div>
      </div>

      <div style={styles.form}>
        <h3>Add Product</h3>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Name</label>
            <select value={productName} onChange={(e) => setProductName(e.target.value)} style={styles.input} >
  <option value="">Select Product</option>
  {allProducts.map((prod) => (
    <option key={prod._id} value={prod.name}>{prod.name}</option>
  ))} 
</select>

          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={styles.input} min="1" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={styles.input} min="0" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>GST (%)</label>
            <input type="number" value={gst} onChange={(e) => setGst(Number(e.target.value))} style={styles.input} min="0" />
          </div>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={handleAddProduct} style={styles.button}>Add Product</button>
      </div>

      <div style={styles.productList}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} style={styles.product}>
              <p>{product.name} (x{product.quantity}) - ₹{product.total}</p>
              <p>GST ({gst}%): ₹{product.gstAmount.toFixed(2)}</p>
              <p>Total with GST: ₹{product.totalWithGST.toFixed(2)}</p>
              <button
                onClick={() => handleDeleteProduct(index)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No products added yet</p>
        )}
      </div>

      <div style={styles.totalSection}>
        <h3>Invoice Summary</h3>
        <p>Subtotal: ₹{calculateTotals().subtotal.toFixed(2)}</p>
        <p>GST Total: ₹{calculateTotals().totalGST.toFixed(2)}</p>
        <p>Total Amount: ₹{calculateTotals().totalWithGST.toFixed(2)}</p>
      </div>

      <div>
        <button onClick={generatePDF} style={styles.button}>Generate Invoice PDF</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: '10px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  form: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  inputRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '60px',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  inputGroup: {
    flex: '1',
    minWidth: '200px', // Minimum width for responsive design
  },
  input: {
    width: '90%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginTop: '8px',
    outline: 'none',
    transition: 'border 0.3s ease-in-out',
  },
  inputFocus: {
    borderColor: '#28a745', // Green color on focus
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '8px',
  },
  button: {
    marginTop: '50px',
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease-in-out',
    marginLeft: 'auto',
    marginRight: 'auto', // This centers the button horizontally
    display: 'block', // Make sure the button behaves as a block element to respect margin auto
},
  buttonHover: {
    backgroundColor: '#218838', // Darker green on hover
  },
  productList: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  product: {
    borderBottom: '1px solid #ddd',
    padding: '10px 0',
    fontSize: '14px',
    color: '#555',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#FFCCCC',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  totalSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  totalText: {
    fontSize: '16px',
    color: '#333',
  },
  totalValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  productHeader: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  pdfButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.3s ease-in-out',
  },
  pdfButtonHover: {
    backgroundColor: '#0056b3', // Darker blue on hover
  },
};

export default BillingPage;

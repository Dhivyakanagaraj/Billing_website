import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Pages/Dashboard';
import BillingPage from './Pages/BillingPage';
import AllBillsPage from './Pages/AllBillsPage';
import ProductsPage from './Pages/ProductsPage';
import CustomersPage from './Pages/CustomersPage';
import Layout from './Components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages without header */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages with header */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/bills" element={<AllBillsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Login failed. Try again.';
      setError(msg);
    }
  };

  return (
    <div style={styles.wrapper}>
  <div style={styles.background}></div>
  <div style={styles.overlay}></div>
  <div style={styles.container}>
    <h1 style={styles.companyName}>RAKESH GLASS & PLYWOOD</h1>
    <h2 style={styles.title}>Welcome Back 👋</h2>
    <p style={styles.subtitle}>Please login to continue</p>
    <form onSubmit={handleLogin} style={styles.form}>
      <input
        type="email"
        placeholder="📧 Email Address"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="🔒 Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button type="submit" style={styles.button}>Login</button>
    </form>
    <p style={styles.register}>
      Don’t have an account?{' '}
      <span
        style={styles.registerLink}
        onClick={() => navigate('/register')}
      >
        Register
      </span>
    </p>
  </div>
</div>

  );
}

const styles = {
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("https://technobendglass.com/images/post-3.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(0px)',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(244, 222, 193, 0.4)', // sandal overlay
    zIndex: 1,
  },
  container: {
    zIndex: 2,
    width: '100%',
    maxWidth: 480,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: 20,
    padding: '40px 32px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    transition: '0.3s ease-in-out',
  },
  companyName: {
    fontSize: '26px',
    fontWeight: 700,
    marginBottom: 16,
    color: '#1f2937',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '24px',
    marginBottom: 6,
    color: '#111827',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '15px',
    marginBottom: 30,
    color: '#6b7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  input: {
    padding: '14px 16px',
    fontSize: 16,
    borderRadius: 10,
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    transition: '0.2s ease',
    outline: 'none',
  },
  button: {
    padding: '14px',
    fontSize: 18,
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s, transform 0.2s',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: -10,
  },
  register: {
    marginTop: 28,
    fontSize: 15,
    color: '#374151',
  },
  registerLink: {
    color: '#2563eb',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
};


export default LoginPage;

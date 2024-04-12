import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleGuestInfoNavigate = (e) => {
    e.preventDefault(); // Prevent form submission
    if (id && !isNaN(id) && isFinite(id)) {
      navigate(`/guest-info/${id}`);
    } else {
      alert('ID phải là số');  // Translated alert message
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cảm ơn bạn đã giúp Duy & Trân quản lý khách mời 🥰</h1>
      <p style={styles.paragraph}>Đây là trang chủ. Bạn có thể điều hướng đến các trang khác từ đây.</p>
      
      {/* Navigation Links */}
      <nav style={styles.nav}>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <Link to="/guests" style={styles.link}>Danh Sách Khách Mời</Link>
          </li>
          {/* Other navigation links can be added here */}
        </ul>
      </nav>
      
      {/* Form for navigating to Guest Info with ID */}
      <form onSubmit={handleGuestInfoNavigate} style={styles.form}>
        <label htmlFor="guestId" style={styles.label}>Nhập ID Khách:</label>
        <input
          type="text"
          id="guestId"
          value={id}
          style={styles.input}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Xem Thông Tin</button>
      </form>
    </div>
  );
}

// Enhanced Styling for better aesthetics and readability
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#fff',
    color: '#333',
    maxWidth: '600px',
    width: '90%',
    minHeight: '80vh',
    margin: '5vh auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    color: '#b00',
    borderBottom: '2px solid #b00',
    fontSize: '24px',
    padding: '10px 0'
  },
  paragraph: {
    marginBottom: '20px',
    fontSize: '18px',
  },
  nav: {
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
  },
  link: {
    color: '#fff',
    backgroundColor: '#b00',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '5px',
    display: 'inline-block',
    transition: 'background-color 0.3s, color 0.3s',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#b00',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'block',
    width: '100%'
  }
};

export default HomePage;

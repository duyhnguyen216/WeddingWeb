// In HomePage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleGuestInfoNavigate = (e) => {
    e.preventDefault(); // Prevent form submission
    if (id) {
      navigate(`/guest-info/${id}`);
    } else {
      alert('ID phải là số');
    }
  };

  return (
    <div>
      <h1>Welcome to Our Guest Management App</h1>
      <p>This is the home page. You can navigate to other pages from here.</p>
      
      {/* Navigation Links */}
      <nav>
        <ul>
          <li><Link to="/guests">Danh Sách Khách Mời</Link></li>
          {/* Other navigation links can be added here */}
        </ul>
      </nav>
      
      {/* Form for navigating to Guest Info with ID */}
      <form onSubmit={handleGuestInfoNavigate}>
        <label htmlFor="guestId">Nhập ID Khách:</label>
        <input
          type="text"
          id="guestId"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit">Xem Thông Tin</button>
      </form>
    </div>
  );
}

export default HomePage;

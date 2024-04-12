import React, { useEffect, useState } from 'react';
import './GuestsList.css';

function GuestsList() {
  const [originalGuests, setOriginalGuests] = useState([]); // Holds the fetched guests
  const [displayGuests, setDisplayGuests] = useState([]); // Holds guests to be displayed (sorted/filtered)
  const [searchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    fetch('http://localhost:8080/api/allguests')
      .then(response => response.json())
      .then(data => {
        setOriginalGuests(data); // Update the original fetched guests
        setDisplayGuests(data);
      })
      .catch(error => console.error('Error fetching guests:', error));
  }, []);

  useEffect(() => {
    let sortedGuests = [...originalGuests].sort((a, b) => {
      if (sortConfig.key === 'isCheckedIn') {
        return sortConfig.direction === 'ascending' ? (a[sortConfig.key] === b[sortConfig.key] ? 0 : a[sortConfig.key] ? -1 : 1) : (a[sortConfig.key] === b[sortConfig.key] ? 0 : a[sortConfig.key] ? 1 : -1);
      } else {
        if (a[sortConfig.key].toString().toLowerCase() < b[sortConfig.key].toString().toLowerCase()) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key].toString().toLowerCase() > b[sortConfig.key].toString().toLowerCase()) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });

    if (searchTerm) {
      sortedGuests = sortedGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm)
      );
    }

    setDisplayGuests(sortedGuests); // Update displayed guests after sorting/filtering
  }, [searchTerm, sortConfig, originalGuests]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="search-container">
      <h2>Danh Sách Khách Mời</h2>
      <input
        type="text"
        placeholder="Tìm theo tên..."
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th className={sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('name')}>Tên</th>
            <th className={sortConfig.key === 'side' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('side')}>Gia Đình</th>
            <th className={sortConfig.key === 'table' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('table')}>Bàn</th>
            <th className={sortConfig.key === 'isCheckedIn' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('isCheckedIn')}>Check In</th>
          </tr>
        </thead>
        <tbody>
          {displayGuests.map((guest) => (
            <tr key={guest.id}>
              <td>{guest.name}</td>
              <td className={guest.side === "T" ? 'nhaTrai' : 'nhaGai'}>
                {guest.side === "T" ? 'Nhà Trai' : 'Nhà Gái'}
              </td>
              <td>{guest.table}</td>
              <td>{guest.isCheckedIn ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GuestsList;

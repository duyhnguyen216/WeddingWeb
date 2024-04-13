import React, { useEffect, useState } from 'react';
import './GuestsList.css';

const pronounce = ["cô", "chú", "cậu", "mợ", "vợ chồng", "anh chị", "anh - chị", "a", "bé", "gia đình", "bạn", "hai bạn", "ông", "em", "chị", "thím", "dì", "cháu", "bác", "con"];

function GuestsList() {
  const [originalGuests, setOriginalGuests] = useState([]); // Holds the fetched guests
  const [displayGuests, setDisplayGuests] = useState([]); // Holds guests to be displayed (sorted/filtered)
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  

  useEffect(() => {
    fetch('/api/allguests')
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
      } else if (sortConfig.key === 'GuestID' || sortConfig.key === 'table') {
        const valueA = parseInt(a[sortConfig.key], 10);
        const valueB = parseInt(b[sortConfig.key], 10);
        return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
      } else if (sortConfig.key === 'name') {
        const valueA = pronounce.reduce((name, prefix) => name.replace(new RegExp("\\b" + prefix + "\\b", "gi"), "").trim(), a[sortConfig.key].toString().trim().toLowerCase());
        const valueB = pronounce.reduce((name, prefix) => name.replace(new RegExp("\\b" + prefix + "\\b", "gi"), "").trim(), b[sortConfig.key].toString().trim().toLowerCase());
        if (valueA < valueB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      else {
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDoubleClick = (guestId, isCheckedIn, name) => {
    const prompt = isCheckedIn ? 'Hủy check in ' + name + ' ?': 'Check in ' + name + '?'; 
    if (window.confirm(prompt)) {
      fetch(`/api/flip-checkin-state/${guestId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          // Assuming the API returns the updated guest list or just the updated guest
          const updatedGuests = originalGuests.map(guest => {
            if (guest.id === guestId) {
              return { ...guest, isCheckedIn: !guest.isCheckedIn };
            }
            return guest;
          });
          setOriginalGuests(updatedGuests);
          setDisplayGuests(updatedGuests.filter(guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase())));
        })
        .catch(error => console.error('Error updating check-in status:', error));
    }
  };

  return (
    <div className="search-container">
      <h2>Danh Sách Khách Mời</h2>
      <input
        type="text"
        placeholder="Tìm theo tên..."
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th className={sortConfig.key === 'GuestID' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('GuestID')}>STT</th>
            <th className={sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('name')}>Tên</th>
            <th className={sortConfig.key === 'side' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('side')}>Gia Đình</th>
            <th className={sortConfig.key === 'table' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('table')}>Bàn</th>
            <th className={sortConfig.key === 'note' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('note')}>Ghi Chú</th>
            <th className={sortConfig.key === 'isCheckedIn' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''} onClick={() => requestSort('isCheckedIn')}>Check In</th>
          </tr>
        </thead>
        <tbody>
          {displayGuests.map((guest) => (
            <tr key={guest.id} onDoubleClick={() => handleDoubleClick(guest.id, guest.isCheckedIn, guest.name)}>
              <td>{guest.GuestID}</td>
              <td>{guest.name}</td>
              <td className={guest.side === "T" ? 'nhaTrai' : guest.side === "G" ? 'nhaGai' : 'friend'}>
                {guest.side === "T" ? 'Nhà Trai' : guest.side === "G" ? 'Nhà Gái' : 'Bạn Cô Dâu Chú Rể'}
              </td>
              <td>{guest.table}</td>
              <td>{guest.note}</td>
              <td>{guest.isCheckedIn ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GuestsList;

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
        removeVietnameseTones(guest.name.toLowerCase()).includes(removeVietnameseTones(searchTerm.toLowerCase()))
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

  function removeVietnameseTones(str) {
    const accents = {
      'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
      'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
      'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
      'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
      'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
      'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
      'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
      'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
      'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
      'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
      'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
      'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
      'Đ': 'D',
      'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
      'đ': 'd'
    };
    return str.split('').map(char => accents[char] || char).join('').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

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

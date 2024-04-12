import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function GuestInfo() {
    const { id } = useParams();
    const [guestInfo, setGuestInfo] = useState(null);

    useEffect(() => {
        // Fetch guest info from the API
        const fetchGuestInfo = async () => {
            const response = await fetch(`http://localhost:8080/api/guests/${id}`); // Adjust API endpoint as needed
            const data = await response.json();
            setGuestInfo(data);
        };

        fetchGuestInfo();
    }, [id]);

    if (!guestInfo) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px', border: '2px solid #ddd', borderRadius: '8px', maxWidth: '300px', margin: '20px auto', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
            <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                {guestInfo.name} - {guestInfo.side === "T" ? <span style={{ color: '#DC143C' }}>Nhà Trai</span> : <span style={{ color: '#FFD700' }}>Nhà Gái</span>}
            </p>
            <p style={{ fontSize: '28px', color: '#555' }}>Bàn: <span style={{ fontWeight: 'bold' }}>{guestInfo.table}</span></p>
            <p style={{ fontSize: '28px', color: '#555' }}>
                Check In: {guestInfo.isCheckedIn ? <span style={{ color: 'green', fontSize: '25px' }}>✅</span> : <span style={{ color: 'red', fontSize: '25px' }}>❌</span>}
            </p>
        </div>


    );
}
export default GuestInfo;
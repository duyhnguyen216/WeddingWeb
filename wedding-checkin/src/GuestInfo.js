import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function GuestInfo() {
    const { id } = useParams();
    const [guestInfo, setGuestInfo] = useState(null);

    useEffect(() => {
        // Fetch guest info from the API
        const fetchGuestInfo = async () => {
            const response = await fetch(`/api/guests/${id}`); // Using environment variable for API URL
            const data = await response.json();
            setGuestInfo(data);
        };

        fetchGuestInfo();
    }, [id]);

    if (!guestInfo) return <div style={styles.loading}>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <p style={styles.name}>
                {guestInfo.name} - {guestInfo.side === "T" ? 
                <span style={styles.brideSide}>Nhà Trai</span> : 
                <span style={styles.groomSide}>Nhà Gái</span>}
            </p>
            <p style={styles.details}>Bàn: <span style={styles.bold}>{guestInfo.table}</span></p>
            <p style={styles.checkIn}>
                Check In: {guestInfo.isCheckedIn ? 
                <span style={styles.checkedIn}>✅</span> : 
                <span style={styles.notCheckedIn}>❌</span>}
            </p>
        </div>
    );
}

// CSS for loading animation
const blinkAnimation = {
    animation: 'blink-animation 1.5s linear infinite',
    color: '#333',
    fontSize: '24px',
    padding: '20px',
    textAlign: 'center'
};

// Keyframes for the blink animation
const globalStyles = document.createElement('style');
globalStyles.innerHTML = `
@keyframes blink-animation {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}`;
document.head.appendChild(globalStyles);

// Enhanced Styling for better aesthetics and readability
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        minHeight: '60vh',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        boxSizing: 'border-box',
    },
    name: {
        fontSize: '34px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    brideSide: {
        color: '#DC143C',
    },
    groomSide: {
        color: '#FFD700',
    },
    details: {
        fontSize: '30px',
        color: '#555',
    },
    bold: {
        fontWeight: 'bold',
    },
    checkIn: {
        fontSize: '30px',
        color: '#555',
    },
    checkedIn: {
        color: 'green',
        fontSize: '28px',
    },
    notCheckedIn: {
        color: 'red',
        fontSize: '28px',
    },
    loading: blinkAnimation
};

export default GuestInfo;
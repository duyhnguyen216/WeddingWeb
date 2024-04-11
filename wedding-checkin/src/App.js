import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GuestInfo from './GuestInfo'; // Adjust the import path to your GuestInfo component
import GuestsList from './GuestsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/guest-info/:id" element={<GuestInfo />} />
        <Route path="/guests" element={<GuestsList />} />
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
}

export default App;

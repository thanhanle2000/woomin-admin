import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../App.css';
import { getObUser } from '../core/db/local';
import LoginPage from '../page/auth/login';
import HomePage from '../page/home/home';
function App() {
  const isCheck = getObUser();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isCheck ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

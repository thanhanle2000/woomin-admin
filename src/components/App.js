import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../App.css';
import { getObUser } from '../core/db/local';
import LoginPage from '../page/auth/login';
import HomePage from '../page/home/home';
import CustomHeader from './custom-header';
import { ImagePage } from '../page/image/image';

function App() {
  // check login
  const isCheck = getObUser();

  return (
    <Router>
      <div className="App">
        <CustomHeader />
        <Routes>
          <Route path="/" element={isCheck ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/image" element={<ImagePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

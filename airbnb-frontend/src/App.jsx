import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </main>
      </div>  s
    </Router>
  );
}

export default App;
import './App.css';
import Navbar from './components/Navbar';
import News from './components/News';
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopLoadingBar from 'react-top-loading-bar';

// Create a wrapper component to handle search params
const AppContent = () => {
  const pageSize = 9;
  const country = 'us';
  const category = 'general';
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  
  // Get search query from URL
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  }, [location.search]);

  return (
    <div>
      <Navbar />
      <TopLoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
        <Routes>
          <Route exact path="/" element={
            <News setProgress={setProgress} apiKey={apiKey} key="general" pageSize={pageSize} country={country} category="general"/>
          }/>
          <Route exact path="/business" element={
            <News setProgress={setProgress} apiKey={apiKey} key="business" pageSize={pageSize} country={country} category="business"/>
          }/>
          <Route exact path="/entertainment" element={
            <News setProgress={setProgress} apiKey={apiKey} key="entertainment" pageSize={pageSize} country={country} category="entertainment"/>
          }/>
          <Route exact path="/general" element={
            <News setProgress={setProgress} apiKey={apiKey} key="general" pageSize={pageSize} country={country} category="general"/>
          }/>
          <Route exact path="/health" element={
            <News setProgress={setProgress} apiKey={apiKey} key="health" pageSize={pageSize} country={country} category="health"/>
          }/>
          <Route exact path="/science" element={
            <News setProgress={setProgress} apiKey={apiKey} key="science" pageSize={pageSize} country={country} category="science"/>
          }/>
          <Route exact path="/sports" element={
            <News setProgress={setProgress} apiKey={apiKey} key="sports" pageSize={pageSize} country={country} category="sports"/>
          }/>
          <Route exact path="/technology" element={
            <News setProgress={setProgress} apiKey={apiKey} key="technology" pageSize={pageSize} country={country} category="technology"/>
          }/>
         
          <Route path="/search" element={
            <News setProgress={setProgress} apiKey={apiKey} key={searchQuery || 'search'} pageSize={pageSize} country={country} isSearch={true}/>
          }/>
        </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Discover from '../Pages/Discover/Discover';
// import About from '../pages/About';
// import NotFound from '../pages/NotFound';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      {/* <Route path="/history" element={<About />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default Router;

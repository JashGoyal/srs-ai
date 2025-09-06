import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Discover from '../Pages/Discover/Discover';
import History from '../Pages/History/History';
import Chat from '../Pages/Chat/Chat';
import NotFound from '../Pages/Notfound';

function Router() {
  return (
    <div className='bg-black'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/history" element={<History />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
  );
}

export default Router;

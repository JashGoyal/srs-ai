import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./component/Header.js/Header";
import Router from "./component/Route/Routes";

function App() {
  const location = useLocation();

  const hideHeader = location.pathname === "/chat";

  return (
    <div className="bg-black">
      {!hideHeader && <Header />}
      <Router />
    </div>
  );
}

export default App;

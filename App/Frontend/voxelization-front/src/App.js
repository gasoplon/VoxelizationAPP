import logo from "./logo.svg";
import "./App.css";
import { RenderPanel } from "./components/RenderPanel";
import React from "react";
import NavigationBar from "./components/NavigationBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/herramienta" element={<RenderPanel />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;

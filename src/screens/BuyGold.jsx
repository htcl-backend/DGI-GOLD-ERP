import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import './styles.css';

const App = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

render(<App />);
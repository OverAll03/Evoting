import React, { useState } from 'react';
import NavItem from '../unlogged/NavItem';
import Button from '../unlogged/Button';
import Sidebar from './Sidebar'; 

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Voting', href: '/voting' },
  { label: 'Results', href: '/results' },
  { label: 'Profile', href: '/profile' },
];

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/97a68acbcd7770dbfb1306aa5d0677ea1bcab6f1edc615fea25e4cd049f5e53c?placeholderIfAbsent=true&apiKey=549c322b647e496e99a9065b5f46d9e4"
            alt="Company logo"
            className="object-contain w-16"
          />
          <nav className="flex gap-4">
            {navItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="outline" to="/logout">Log Out</Button>
          <button
            onClick={toggleSidebar}
            className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
        </div>
      </div>
      {sidebarVisible && <Sidebar />}
    </header>
  );
};

export default Header;


import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center">
      <p>&copy; 2024 E-Voting Platform</p>
      <div className="mt-2">
        <a href="/terms" className="hover:underline">Terms of Service</a> | 
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;

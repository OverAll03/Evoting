import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiFlag, FiSettings, FiLock, FiLogOut, FiUser } from 'react-icons/fi';

const Sidebar = () => {
    const [isToggled, setIsToggled] = useState(true);
    const location = useLocation();
    const currentPath = location.pathname;

    const handleToggle = () => setIsToggled(!isToggled);

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 p-3 w-full transition-colors duration-300 ${
                currentPath === to ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-blue-500 hover:text-white'
            } rounded-md`}
        >
            <Icon size={20} />
            {isToggled && <span className="ml-2">{label}</span>}
        </Link>
    );

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-blue-900 text-white shadow-xl transition-all duration-300 ${
                isToggled ? 'w-64' : 'w-16'
            }`}
        >
            <button
                className="absolute top-3 right-4 text-gray-300 hover:text-white transition-colors duration-300"
                onClick={handleToggle}
            >
                <FiMenu size={24} />
            </button>
            <div className={`flex flex-col pt-12 h-full ${isToggled ? 'pl-5' : 'items-center'}`}>
                <div className={`flex flex-col space-y-4 ${isToggled ? 'items-start' : 'items-center'}`}>
                    <NavLink to="/dashboard" icon={FiHome} label="Dashboard" />
                    <NavLink to="/vote" icon={FiFlag} label="Vote" />
                    <NavLink to="/manage-sessions" icon={FiUser} label="Manage Sessions" />
                    <NavLink to="/security" icon={FiLock} label="Security" />
                </div>
                <div className="mt-auto mb-5">
                    <NavLink to="/preferences" icon={FiSettings} label="Preferences" />
                    <NavLink to="/logout" icon={FiLogOut} label="Logout" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';
import Button from './Button';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Vote', href: '/vote' },
    { label: 'Results', href: '/results' },
    { label: 'About Us', href: '#' },
];

const API_BASE_URL = 'http://localhost:5000/api/auth';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/profile`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setProfile(response.data);
                    setIsLoggedIn(true);
                } catch (err) {
                    setError('Erreur lors de la récupération du profil.');
                    setIsLoggedIn(false);
                }
            };
            fetchProfile();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setProfile(null);
    };

    return (
        <header className="bg-blue-700 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">

                    <nav className="flex gap-6">
                        {navItems.map((item, index) => (
                            <NavItem key={index} {...item} className="hover:text-gray-300 transition duration-300" />
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <FaUserCircle className="text-2xl text-white" />
                            <Link to="/profile" className="text-white hover:text-gray-300">
                                {profile ? profile.name : 'User'}
                            </Link>
                            <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                        </div>
                    ) : (
                        <>
                            <Button variant="outline" to="/login">Log in</Button>
                            <Button variant="outline" to="/signup">Sign Up</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;

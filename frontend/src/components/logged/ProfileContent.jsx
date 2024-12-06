import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaEnvelope, FaEthereum } from 'react-icons/fa'; // Importation d'icônes
const API_BASE_URL = 'http://localhost:5000/api/auth';

const ProfileContent = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const truncateEthAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    useEffect(() => {
        // Fonction pour récupérer le profil utilisateur
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des informations du profil.');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!profile) {
        return <p>Chargement du profil...</p>;
    }

    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Mon Profil</h2>
            <div className="flex items-center justify-center mb-6">
                <FaUserCircle className="text-7xl text-blue-600" />
            </div>
            <div className="space-y-6">
                {/* Nom de l'utilisateur */}
                <div className="bg-white p-4 rounded-md shadow-md flex items-center space-x-4 hover:bg-blue-50 transition duration-300">
                    <FaUserCircle className="text-blue-500 text-2xl" />
                    <div>
                        <p className="text-lg font-semibold text-gray-700">Nom</p>
                        <p className="text-gray-500">{profile.name}</p>
                    </div>
                </div>
                
                {/* Email de l'utilisateur */}
                <div className="bg-white p-4 rounded-md shadow-md flex items-center space-x-4 hover:bg-blue-50 transition duration-300">
                    <FaEnvelope className="text-blue-500 text-2xl" />
                    <div>
                        <p className="text-lg font-semibold text-gray-700">Email</p>
                        <p className="text-gray-500">{profile.email}</p>
                    </div>
                </div>

                {/* Adresse Ethereum */}
                <div className="bg-white p-4 rounded-md shadow-md flex items-center space-x-4 hover:bg-blue-50 transition duration-300">
                    <FaEthereum className="text-blue-500 text-2xl" />
                    <div>
                        <p className="text-lg font-semibold text-gray-700">Adresse Ethereum</p>
                        <p className="text-gray-500">{truncateEthAddress(profile.ethereumAddress)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;

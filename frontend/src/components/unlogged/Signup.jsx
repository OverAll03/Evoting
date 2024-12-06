import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const connectGanacheMetaMask = async () => {
    setErrorMessage('');
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask n'est pas installé.");
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setEthereumAddress(account);
    } catch (error) {
      setErrorMessage("Erreur lors de la connexion à MetaMask : " + error.message);
      console.error("Erreur lors de la connexion à MetaMask :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage("Veuillez entrer votre nom.");
      return;
    }

    if (!ethereumAddress) {
      setErrorMessage("Veuillez connecter votre compte MetaMask.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        name,
        email,
        password,
        ethereumAddress
      });

      if (response.status === 201) {
        console.log("Compte créé avec succès.");
        navigate('/dashboard');
      } else {
        setErrorMessage(response.data.message || "Erreur lors de la création du compte.");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la création du compte : " + (error.response?.data?.message || error.message));
      console.error("Erreur lors de la création du compte :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Adresse Ethereum</label>
        <input
          type="text"
          value={ethereumAddress}
          readOnly
          placeholder="Connectez MetaMask"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={connectGanacheMetaMask}
          className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Connecter MetaMask
        </button>
      </div>

      <Button type="submit" variant="primary">Créer un compte</Button>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default Signup;

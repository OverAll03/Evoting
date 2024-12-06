import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';
import Web3 from 'web3';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //const [ethAddress, setEthAddress] = useState('');

  const [loading, setLoading] = useState(false);

  const connectMetaMask = async () => {
    setErrorMessage('');
    setLoading(true);
  
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask non installé');
      }
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      //setEthAddress(account);
      const nonceResponse = await axios.post(`${API_BASE_URL}/request-nonce`, { ethAddress: account });
      const nonce = nonceResponse.data.nonce;
      const message = `Please sign this message to log in: ${nonce}`;
  
      if (!nonce) {
        throw new Error('Erreur: nonce manquant');
      }
  
      const web3 = new Web3(window.ethereum);
      const signature = await web3.eth.personal.sign(message, account, '');
  
      if (!signature) {
        throw new Error('Erreur: signature manquante');
      }
  
      const loginResponse = await axios.post(`${API_BASE_URL}/login-metamask`, {
        ethAddress: account,
        signature: signature,
      });
  
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        navigate('/dashboard');
      } else {
        throw new Error('Erreur lors de la connexion avec MetaMask.');
      }
  
    } catch (error) {
      console.error("Erreur lors de la connexion à MetaMask:", error);
      setErrorMessage("Erreur lors de la connexion à MetaMask: " + error.message);
    } finally {
      setLoading(false); 
    }
  };
  
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage('Erreur lors de la connexion.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage('Erreur lors de la connexion: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Connexion</h2>
  
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        <div className="text-center">
          <Button variant="primary" className="w-full py-3" disabled={loading}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </Button>
        </div>
      </form>
  
      <div className="flex justify-center mt-6">
        <button
          onClick={connectMetaMask}
          className="bg-blue-500 text-white w-full max-w-md mx-auto px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Connexion via MetaMask'}
        </button>
      </div>
  
      {errorMessage && (
        <p className="mt-4 text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </div>
  );
  
};

export default Login;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/blockchain';

export const getElections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/elections`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des élections :", error);
    throw error;
  }
};

export const createElection = async (name, description, startDate, endDate, isPrivate, authorizedVoters) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/elections/new`, {
      name,
      description,
      startDate,
      endDate,
      isPrivate,
      authorizedVoters
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
    return response.data.electionId;
  } catch (error) {
    console.error("Erreur lors de la création de l'élection :", error);
    throw error;
  }
};

export const addCandidate = async (electionId, name, program) => {
  try {
    await axios.post(`${API_BASE_URL}/elections/${electionId}/candidates`, {
      name,
      program
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
  } catch (error) {
    console.error("Erreur lors de l'ajout du candidat :", error);
    throw error;
  }
};

export const vote = async (electionId, candidateId, voter) => {
  try {
    await axios.post(`${API_BASE_URL}/elections/${electionId}/vote`, {
      candidateId,
      voter
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
  } catch (error) {
    console.error("Erreur lors du vote :", error);
    throw error;
  }
};

export const checkElectoralAuthority = async (address) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/electoral-authorities/${address}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
    return response.data.isAuthority; 
  } catch (error) {
    console.error("Erreur lors de la vérification de l'adresse :", error);
    throw error;
  }
};

export const addElectoralAuthority = async (ethAddress) => {
  try {
    await axios.post(`${API_BASE_URL}/electoral-authorities`, { ethAddress }, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'autorité électorale :", error);
    throw error;
  }
};

export const getResults = async (electionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/results`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats :", error);
    throw error;
  }
};

export const getOngoingElections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ongoingelections`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des élections en cours :", error);
    throw error;
  }
};

export const getCompletedElections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/completedelections`);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des élections terminées :", error);
    throw error;
  }
};

export const getElectionDetails = async (electionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'élection :", error);
    throw error;
  }
};

export const getCandidates = async (electionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/candidates`);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des candidats :", error);
    throw error;
  }
};

export const startElectionAutomation = async (electionId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/startElectionAutomation`, { electionId }, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }});
    
    if (response.status === 200) {
      console.log(`Automation started successfully for election ID: ${electionId}`);
      return response.data; 
    } else {
      throw new Error(`Erreur lors du démarrage de l'automatisation de l'élection. Statut : ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du démarrage de l\'automatisation de l\'élection:', error);
    throw error;
  }
};
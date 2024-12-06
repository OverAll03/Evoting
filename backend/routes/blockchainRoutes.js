const express = require('express');
const {
  getElections,
  getElectionDetails,
  getElectionCandidates,
  createElection,
  addCandidate,
  vote,
  checkElectoralAuthority,
  addElectoralAuthority,
  getOngoingElections,
  getCompletedElections,
  getResults,
  startElectionAutomation
} = require('../blockchainService');
const authMiddleware = require('./authMiddleWare');

const router = express.Router();

router.get('/elections', async (req, res) => {
  try {
    const elections = await getElections();
    res.status(201).json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/elections/new', authMiddleware, async (req, res) => {
  const { name, description, startDate, endDate, isPrivate, authorizedVoters } = req.body;

  const voters = isPrivate ? authorizedVoters : [];

  try {
    const electionId = await createElection(name, description, startDate, endDate, isPrivate, voters);
    res.status(201).json({ electionId });
  } catch (error) {
    console.error('Erreur lors de la création de l\'élection:', error.message);
    res.status(500).json({ error: `Erreur lors de la création de l'élection: ${error.message}` });
  }
});

router.get('/elections/:electionId', async (req, res) => {
  const electionId = req.params.electionId;

  try {
    const electionDetails = await getElectionDetails(electionId);
    res.json(electionDetails); // Envoyer les détails d'élection sous forme de JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'élection :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des détails de l'élection" });
  }
});

router.post('/elections/:electionId/candidates', authMiddleware, async (req, res) => {
  console.log('Params', req.params);
  console.log(req.body);
  const { electionId } = req.params;
  const { name, program } = req.body;
  try {
    await addCandidate(electionId, name, program);
    res.status(200).json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/elections/:electionId/candidates', async (req, res) => {
  const { electionId } = req.params;
  
  try {
    // Appel à la fonction getElectionCandidates
    const candidates = await getElectionCandidates(electionId);
    res.json(candidates); // Renvoie la liste des candidats au frontend
  } catch (error) {
    console.error("Erreur lors de la récupération des candidats:", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des candidats." });
  }
});

router.post('/elections/:electionId/vote', async (req, res) => {
  const { electionId } = req.params;
  const { candidateId, voter } = req.body;
  try {
    await vote(electionId, candidateId, voter);
    res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/authorities/check/:address', authMiddleware, async (req, res) => {
  const { address } = req.params;
  try {
    const isAuthority = await checkElectoralAuthority(address);
    res.json({ isAuthority });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/authorities', authMiddleware, async (req, res) => {
  const { ethAddress } = req.body;
  try {
    await addElectoralAuthority(ethAddress);
    res.status(201).json({ message: 'Electoral authority added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ongoingelections/', async (req, res) => {
  try {
    const ongoingElections = await getOngoingElections();
    res.json(ongoingElections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/completedelections/', async (req, res) => {
  try {
    const completedElections = await getCompletedElections();
    res.json(completedElections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/elections/:electionId/results', async (req, res) => {
  const { electionId } = req.params;
  try {
    const results = await getResults(electionId);
    console.log(results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/startElectionAutomation', async (req, res) => {
  const { electionId } = req.body;

  try {
    // Appel à la fonction d'automatisation des élections
    const result = await startElectionAutomation(electionId);
    res.status(200).json({ message: "Automation started", result });
  } catch (error) {
    console.error('Erreur lors du démarrage de l\'automatisation de l\'élection:', error);
    res.status(500).json({ error: 'Erreur lors du démarrage de l\'automatisation' });
  }
});

module.exports = router;

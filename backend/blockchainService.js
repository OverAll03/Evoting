const { Web3 } = require('web3');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const provider = new Web3.providers.HttpProvider(process.env.GANACHE_URL || 'http://localhost:7545');
const web3 = new Web3(provider);

const EvotingABI = require('./smart-contract/build/contracts/EVoting.json');
const contractAddress = process.env.CONTRACT_ADDRESS;
const electionContract = new web3.eth.Contract(EvotingABI.abi, contractAddress);

// Fonction pour récupérer les élections
const getElections = async () => {
  try {
    const electionCount = await electionContract.methods.electionCount().call();
    const elections = [];

    for (let i = 1; i <= electionCount; i++) {
      const election = await electionContract.methods.elections(i).call();

      // Convertir les BigInt en numbers là où c'est pertinent
      const formattedElection = {
        id: Number(election.id), // Convertir BigInt en number
        name: election.name,
        description: election.description,
        startDate: Number(election.startDate), // Convertir BigInt en number
        endDate: Number(election.endDate), // Convertir BigInt en number
        isPrivate: election.isPrivate,
        votingSessionOpen: election.votingSessionOpen,
        status: Number(election.status) // Convertir BigInt en number
      };

      elections.push(formattedElection);
    }

    return elections;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des élections: " + error.message);
  }
};

// Créer une élection
const createElection = async (name, description, startDate, endDate, isPrivate, voters) => {
  const accounts = await web3.eth.getAccounts();
  const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
  console.log(voters);
  try {
    const gasEstimate = await electionContract.methods
      .createElection(name, description, startTimestamp, endTimestamp, isPrivate, voters)
      .estimateGas({ from: accounts[0] });

    const result = await electionContract.methods
      .createElection(name, description, startTimestamp, endTimestamp, isPrivate, voters)
      .send({ from: accounts[0], gas: gasEstimate });

    const _electionId = Number(result.events.ElectionCreated.returnValues.electionId);
    return _electionId;
  } catch (error) {
    throw new Error("Erreur lors de la création de l'élection: " + error.message);
  }
};

// Récupérer les détails d'une Élection
const getElectionDetails = async (electionId) => {
  try {
    const electionDetails = await electionContract.methods.getElectionDetails(electionId).call();

    // Convertir les BigInt en numbers là où c'est pertinent
    const formattedDetails = {
      name: electionDetails[0],
      description: electionDetails[1],
      isPrivate: electionDetails[2],
      votingSessionOpen: electionDetails[3],
      startDate: Number(electionDetails[4]), // Convertir BigInt en number
      endDate: Number(electionDetails[5]), // Convertir BigInt en number
      candidates: electionDetails[6].map(candidate => ({
        id: Number(candidate.id),
        name: candidate.name,
        program: candidate.program,
        voteCount: Number(candidate.voteCount)
      })),
      voters: electionDetails[7].map(voter => ({
        id: Number(voter.id),
        name: voter.name,
        surname: voter.surname,
        email: voter.email,
        hasVoted: voter.hasVoted
      }))
    };

    return formattedDetails;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des détails de l'élection : " + error.message);
  }
};

// Ajouter un candidat
const addCandidate = async (electionId, name, program) => {
  const accounts = await web3.eth.getAccounts();
  try {
    console.log('ElectionID: ', electionId, 'Type: ', typeof electionId);
    const gasEstimate = await electionContract.methods
      .addCandidate(electionId, name, program)
      .estimateGas({ from: accounts[0] });

    await electionContract.methods
      .addCandidate(electionId, name, program)
      .send({ from: accounts[0], gas: gasEstimate });
  } catch (error) {
    throw new Error("Erreur lors de l'ajout du candidat: " + error.message);
  }
};

// Soumettre un vote
const vote = async (electionId, candidateId, voter) => {
  const accounts = await web3.eth.getAccounts();
  try {
    const gasEstimate = await electionContract.methods
      .vote(electionId, candidateId, voter.id, voter.name, voter.surname, voter.email)
      .estimateGas({ from: accounts[0] });
      console.log(gasEstimate);
    await electionContract.methods
      .vote(electionId, candidateId, voter.id, voter.name, voter.surname, voter.email)
      .send({ from: accounts[0], gas: gasEstimate });
  } catch (error) {
    throw new Error("Erreur lors du vote: " + error.message);
  }
};

// Vérifier une autorité électorale
const checkElectoralAuthority = async (address) => {
  try {
    return await electionContract.methods.checkElectoralAuthority(address).call();
  } catch (error) {
    throw new Error("Erreur lors de la vérification de l'adresse: " + error.message);
  }
};

// Ajouter une autorité électorale
const addElectoralAuthority = async (ethAddress) => {
  const accounts = await web3.eth.getAccounts();
  try {
    const gasEstimate = await electionContract.methods
      .addElectoralAuthority(ethAddress)
      .estimateGas({ from: accounts[0] });

    await electionContract.methods
      .addElectoralAuthority(ethAddress)
      .send({ from: accounts[0], gas: gasEstimate });
  } catch (error) {
    throw new Error("Erreur lors de l'ajout de l'autorité électorale: " + error.message);
  }
};

// Récupérer les résultats
const getResults = async (electionId) => {
  try {
    // Utiliser la fonction getCandidates pour obtenir les détails des candidats
    const candidates = await getElectionCandidates(electionId);

    // Retourner les résultats avec le nom des candidats et leur nombre de voix
    return candidates.map(candidate => ({
      name: candidate.name,
      voteCount: candidate.voteCount
    }));
  } catch (error) {
    throw new Error("Erreur lors de la récupération des résultats: " + error.message);
  }
};

// Récupérer les élections en cours
const getOngoingElections = async () => {
  try {
    const electionCount = await electionContract.methods.electionCount().call();
    const ongoingElections = [];

    for (let i = 1; i <= electionCount; i++) {
      const election = await electionContract.methods.elections(i).call();

      if (election.votingSessionOpen) {
        // Formatage des champs BigInt en nombres ou chaînes
        const formattedElection = {
          id: election.id.toString(), // Convertir en chaîne
          name: election.name,
          description: election.description,
          startDate: Number(election.startDate), // Convertir en nombre pour les dates
          endDate: Number(election.endDate),
          isPrivate: election.isPrivate,
          votingSessionOpen: election.votingSessionOpen,
          status: Number(election.status) // Statut en nombre
        };

        ongoingElections.push(formattedElection);
      }
    }

    return ongoingElections;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des élections en cours: " + error.message);
  }
};

// Récupérer les élections terminées
const getCompletedElections = async () => {
  try {
    // Appel pour récupérer les IDs des élections terminées
    const completedElectionIds = await electionContract.methods.getCompletedElections().call();

    const elections = [];
    
    // Boucle pour récupérer les détails de chaque élection terminée
    for (const id of completedElectionIds) {
      const electionDetails = await electionContract.methods.getElectionDetails(id).call();

      // Formatage des données de l'élection, avec conversion des BigInt en nombre ou chaîne
      elections.push({
        id: Number(id), // Conversion de BigInt en chaîne
        name: electionDetails.name,
        startDate: Number(electionDetails.startDate), // Conversion en nombre
        endDate: Number(electionDetails.endDate) // Conversion en nombre
      });
    }

    return elections;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des élections terminées: " + error.message);
  }
};

// Récupérer la liste des candidats d'une élection spécifique
const getElectionCandidates = async (electionId) => {
  try {
    // Appel à getElectionDetails pour obtenir les détails de l'élection
    const electionDetails = await getElectionDetails(electionId);

    // Extraction des candidats depuis les détails de l'élection
    const candidates = electionDetails.candidates.map(candidate => ({
      id: candidate.id.toString(), // Convertir les BigInt en chaînes
      name: candidate.name,
      program: candidate.program,
      voteCount: Number(candidate.voteCount), // Assurez-vous que le nombre de votes est un nombre
    }));

    return candidates;
  } catch (error) {
    console.error("Erreur lors de la récupération des candidats:", error.message);
    throw new Error("Erreur lors de la récupération des candidats: " + error.message);
  }
};

const scheduleStartElection = async (electionId, startTime) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const delay = (startTime - currentTime) * 1000;

  if (delay > 0) {
    console.log(`Starting election ${electionId} in ${delay / 1000} seconds...`);
    setTimeout(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const gasEstimate = await electionContract.methods.openVotingSession(electionId).estimateGas({ from: accounts[0] });
        await electionContract.methods.openVotingSession(electionId).send({ from: accounts[0], gas: gasEstimate });
      } catch (error) {
        console.error(`Error starting voting session for election ${electionId}:`, error);
      }
    }, delay);
  } else {
    console.warn(`The start time for election ${electionId} has already passed.`);
  }
};

const scheduleEndElection = async (electionId, endTime) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const delay = (endTime - currentTime) * 1000;

  if (delay > 0) {
    console.log(`Ending election ${electionId} in ${delay / 1000} seconds...`);
    setTimeout(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const gasEstimate = await electionContract.methods.closeVotingSession(electionId).estimateGas({ from: accounts[0] });
        await electionContract.methods.closeVotingSession(electionId).send({ from: accounts[0], gas: gasEstimate });
      } catch (error) {
        console.error(`Error ending voting session for election ${electionId}:`, error);
      }
    }, delay);
  } else {
    console.warn(`The end time for election ${electionId} has already passed.`);
  }
};

const startElectionAutomation = (electionId) => {
  console.log(`Starting automation for election ID: ${electionId}`);
  automateElectionManagement(electionId);
  return "started";
};

const automateElectionManagement = async (electionId) => {
  try {
    const electionDetails = await getElectionDetails(electionId);
    const startDate = Math.floor(new Date(electionDetails.startDate).getTime());
    const endDate = Math.floor(new Date(electionDetails.endDate).getTime());
    console.log(startDate, endDate);
    await scheduleStartElection(electionId, startDate + 30);
    await scheduleEndElection(electionId, endDate + 30);
  } catch (error) {
    console.error(`Error automating election ${electionId}:`, error);
  }
};

module.exports = {
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
  startElectionAutomation,
};

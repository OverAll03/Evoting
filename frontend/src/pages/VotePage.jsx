import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOngoingElections, getElectionDetails, getCandidates, vote } from '../blockchainService';
import Footer from '../components/unlogged/Footer';
import Header from '../components/unlogged/Header';

const VotePage = () => {
  const { id } = useParams();
  const [elections, setElections] = useState([]);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voterInfo, setVoterInfo] = useState({ id: '', name: '', surname: '', email: '' });
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) {
          const ongoingElections = await getOngoingElections();
          setElections(ongoingElections);
        } else {
          const [electionDetails, electionCandidates] = await Promise.all([
            getElectionDetails(id),
            getCandidates(id)
          ]);
          setElection(electionDetails);
          setCandidates(electionCandidates);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setMessage("Erreur lors de la récupération des données.");
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleElectionClick = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  const handleVoterInfoChange = (e) => {
    setVoterInfo({ ...voterInfo, [e.target.name]: e.target.value });
  };

  const handleVote = async () => {
  
    try {
      setMessage("Envoi de votre vote en cours...");
      
      let voterId = voterInfo.id;
      if (!election.isPrivate) {
       
        let t = await getElectionDetails(id);
        voterId = t.voters.length + 1;
      }
  
      const votePayload = {
        ...voterInfo,
        id: voterId, 
      };

      if (!selectedCandidateId || Object.values(votePayload).some(value => !value)) {
        setMessage("Veuillez remplir tous les champs et sélectionner un candidat.");
        return;
      }
      
      console.log(votePayload);
      await vote(id, selectedCandidateId, votePayload);
      setMessage("Vote soumis avec succès !");
      setTimeout(() => navigate('/vote'), 3000);
    } catch (error) {
      console.error("Erreur lors de la soumission du vote :", error);
      setMessage("Erreur lors de la soumission du vote. Veuillez réessayer.");
    }
  };
  

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-4xl bg-white rounded-lg shadow-md mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader bg-blue-600 text-white p-3 rounded-full text-lg">Chargement...</div>
          </div>
        ) : (
          <>
            {!id ? (
              <div>
                <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Élections en cours</h2>
                {elections.length === 0 ? (
                  <p className="text-lg text-center text-gray-700">Aucune élection en cours pour le moment.</p>
                ) : (
                  <ul className="space-y-6">
                    {elections.map(election => (
                      <li
                        key={election.id}
                        onClick={() => handleElectionClick(election.id)}
                        className="p-6 border rounded-lg shadow hover:shadow-lg bg-gradient-to-r from-white to-blue-50 cursor-pointer"
                      >
                        <h3 className="text-2xl font-semibold text-gray-800">{election.name}</h3>
                        <p className="text-gray-600">Date de début : {new Date(election.startDate * 1000).toLocaleDateString()}</p>
                        <p className="text-gray-600">Date de fin : {new Date(election.endDate * 1000).toLocaleDateString()}</p>
                        <p className="text-gray-600">
                          Type : <span className="font-semibold">{election.isPrivate ? 'Privée' : 'Publique'}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            ) : (
              election && (
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                  <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Votez pour l'élection : {election.name}</h2>
                  <p className="text-gray-500 mb-6 text-center">Veuillez remplir vos informations et sélectionner un candidat pour voter.</p>

                  {/* Voter Information Form */}
                  <div className="space-y-6">
                    {election.isPrivate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <input
                          type="text"
                          name="id"
                          value={voterInfo.id}
                          onChange={handleVoterInfoChange}
                          className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                          type="text"
                          name="surname"
                          value={voterInfo.surname}
                          onChange={handleVoterInfoChange}
                          className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                          type="text"
                          name="name"
                          value={voterInfo.name}
                          onChange={handleVoterInfoChange}
                          className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={voterInfo.email}
                        onChange={handleVoterInfoChange}
                        className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Candidate Selection */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3 text-blue-600">Sélectionnez un candidat</h3>
                    <div className="space-y-4">
                      {candidates.map(candidate => (
                        <div key={candidate.id} className="flex items-center space-x-3 p-4 border rounded-md shadow-sm hover:bg-blue-50 cursor-pointer transition">
                          <input
                            type="radio"
                            id={`candidate-${candidate.id}`}
                            name="candidate"
                            value={candidate.id}
                            onChange={() => setSelectedCandidateId(candidate.id)}
                            className="form-radio text-blue-600"
                          />
                          <label htmlFor={`candidate-${candidate.id}`} className="text-gray-700 font-medium">
                            {candidate.name}
                            <span className="text-sm text-gray-500">- {candidate.program}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      onClick={handleVote}
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Soumettre le vote
                    </button>
                    {message && (
                      <div className={`mt-4 p-3 rounded ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                      </div>
                    )}
                  </div>
                </div>

              )
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VotePage;

import React, { useState, useEffect } from 'react';
import { getCompletedElections, getResults, getElectionDetails } from '../blockchainService';
import Header from '../components/unlogged/Header';
import Footer from '../components/unlogged/Footer';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Results = () => {
  const [completedElections, setCompletedElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidatesResults, setCandidatesResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchCompletedElections = async () => {
      try {
        const elections = await getCompletedElections();
        setCompletedElections(elections);
        setMessage('');
      } catch (error) {
        console.error("Erreur lors de la récupération des élections terminées :", error);
        setMessage('Erreur lors de la récupération des élections terminées.');
      }
      setLoading(false);
    };

    fetchCompletedElections();
  }, []);

  const handleViewResults = async (electionId) => {
    setLoadingResults(true);
    setShowModal(true);
    try {
      const electionDetails = await getElectionDetails(electionId);
      setSelectedElection(electionDetails);

      const results = await getResults(electionId);
      setCandidatesResults(results);

      const winnerCandidate = results.reduce((prev, current) => (prev.voteCount > current.voteCount ? prev : current));
      setWinner(winnerCandidate);

      setMessage('');
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats :", error);
      setMessage("Erreur lors de la récupération des résultats.");
    }
    setLoadingResults(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedElection(null);
    setCandidatesResults([]);
    setWinner(null);
  };

  const barChartData = {
    labels: candidatesResults.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Nombre de voix',
        data: candidatesResults.map(candidate => candidate.voteCount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const pieChartData = {
    labels: candidatesResults.map(candidate => candidate.name),
    datasets: [
      {
        data: candidatesResults.map(candidate => candidate.voteCount),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Résultats des élections terminées</h2>

        {loading ? (
          <p className="text-center">Chargement des élections terminées...</p>
        ) : message ? (
          <p className="text-center text-red-500">{message}</p>
        ) : completedElections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedElections.map(election => (
              <div key={election.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{election.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Du {new Date(election.startDate * 1000).toLocaleDateString()} au {new Date(election.endDate * 1000).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleViewResults(election.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-2"
                >
                  Voir les résultats
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Aucune élection terminée trouvée.</p>
        )}

        {showModal && selectedElection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Résultats de l'élection : {selectedElection.name}</h3>
                <button onClick={closeModal} className="text-2xl font-bold">&times;</button>
              </div>
              {loadingResults ? (
                <p>Chargement des résultats...</p>
              ) : (
                <>
                  <div className="bg-blue-100 p-4 rounded-lg mb-4">
                    <h4 className="text-xl font-semibold text-center mb-2">Gagnant</h4>
                    {winner ? (
                      <p className="text-2xl font-bold text-center">{winner.name} avec {winner.voteCount} voix</p>
                    ) : (
                      <p className="text-center">Aucun gagnant déterminé.</p>
                    )}
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="w-1/2 pr-2">
                      <Bar data={barChartData} options={{ responsive: true }} height={200} />
                    </div>
                    <div className="w-1/2 pl-2">
                      <Pie data={pieChartData} options={{ responsive: true }} height={200} />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2">Candidat</th>
                          <th className="border p-2">Nombre de voix</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatesResults.map((candidate, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border p-2">{candidate.name}</td>
                            <td className="border p-2">{candidate.voteCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;

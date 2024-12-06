import React, { useState, useEffect } from 'react';
import { getElections, createElection, addCandidate, getElectionDetails, startElectionAutomation } from '../../blockchainService';
import Papa from 'papaparse';

const ManageSessionsContent = () => {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [newElection, setNewElection] = useState({
    name: '',
    description: '',
    candidates: [],
    isPrivate: false,
    startDate: '',
    endDate: '',
    authorizedVoters: []
  });
  const [candidateName, setCandidateName] = useState('');
  const [candidateProgram, setCandidateProgram] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const userElections = await getElections();
      setElections(userElections);
      setFilteredElections(userElections);
    } catch (error) {
      console.error('Erreur lors de la récupération des élections:', error);
      setElections([]);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = elections.filter(election =>
      election.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredElections(filtered);
  };

  const handleOpenCreatePopup = () => setIsCreatePopupOpen(true);
  const handleCloseCreatePopup = () => {
    setIsCreatePopupOpen(false);
    setNewElection({ name: '', description: '', candidates: [], isPrivate: false, startDate: '', endDate: '', authorizedVoters: [] });
    setCandidateName('');
    setCandidateProgram('');
    setError(null);
  };

  const handleOpenDetailsPopup = async (election) => {
    try {
      setError(null);
      const details = await getElectionDetails(election.id);
      setSelectedElection(details);
      setIsDetailsPopupOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'élection:', error);
      setError(`Erreur: ${error.message}`);
      setIsDetailsPopupOpen(true);
    }
  };

  const handleCloseDetailsPopup = () => setIsDetailsPopupOpen(false);

  const handleAddCandidate = () => {
    if (candidateName.trim() && candidateProgram.trim()) {
      setNewElection(prev => ({
        ...prev,
        candidates: [...prev.candidates, { name: candidateName.trim(), program: candidateProgram.trim() }],
      }));
      setCandidateName('');
      setCandidateProgram('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const voters = results.data
          .filter(row => row.id && row.name && row.surname && row.email)
          .map(row => ({
            id: row.id.trim(),
            name: row.name.trim(),
            surname: row.surname.trim(),
            email: row.email.trim(),
            hasVoted: false
          }));
        setNewElection(prev => ({
          ...prev,
          authorizedVoters: voters
        }));
      },
      error: (error) => {
        console.error("Erreur lors du parsing du fichier CSV :", error);
        setError('Erreur lors du parsing du fichier CSV. Veuillez vérifier le format.');
      }
    });
  };

  const handleCreateElection = async (event) => {
    event.preventDefault();

    if (newElection.candidates.length < 2) {
      alert('Veuillez ajouter au moins 2 candidats.');
      return;
    }

    if (!newElection.startDate || !newElection.endDate) {
      alert('Veuillez spécifier les dates de début et de fin.');
      return;
    }

    if (newElection.isPrivate && newElection.authorizedVoters.length === 0) {
      alert('Veuillez fournir la liste des votants autorisés pour les élections privées.');
      return;
    }

    try {
      const newId = await createElection(
        newElection.name,
        newElection.description,
        newElection.startDate,
        newElection.endDate,
        newElection.isPrivate,
        newElection.authorizedVoters
      );

      for (const candidate of newElection.candidates) {
        await addCandidate(newId, candidate.name, candidate.program);
      }

      alert('Élection et candidats créés avec succès !');
      handleCloseCreatePopup();
      fetchElections();
      startElectionAutomation(Number(newId));

    } catch (error) {
      console.error('Erreur lors de la création de l\'élection:', error);
      alert('Erreur lors de la création de l\'élection. Veuillez réessayer.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">Gestion des Élections</h2>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Rechercher une élection..."
          className="border rounded-lg px-4 py-2 w-2/3"
        />
        <button
          onClick={handleOpenCreatePopup}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Créer une élection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredElections.map(election => {
          const isOngoing = election.votingSessionOpen;
          const now = Date.now() / 1000;
          const isUpcoming = now < election.startDate;
          const isEnded = now > election.endDate;

          let statusText = '';
          let statusColor = '';

          if (isOngoing) {
            statusText = 'En cours';
            statusColor = 'bg-green-100 text-green-600';
          } else if (isUpcoming) {
            statusText = 'À venir';
            statusColor = 'bg-yellow-100 text-yellow-600';
          } else if (isEnded) {
            statusText = 'Terminée';
            statusColor = 'bg-gray-200 text-gray-600';
          } else {
            statusText = 'Non démarrée';
            statusColor = 'bg-red-100 text-red-600';
          }

          return (
            <div
              key={election.id}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 ${statusColor}`}
              onClick={() => handleOpenDetailsPopup(election)}
            >
              <h3 className="text-xl font-semibold mb-2">{election.name}</h3>
              <p className={`text-sm mb-2 ${!election.isPrivate ? 'text-green-500' : 'text-red-500'}`}>
                Type: {!election.isPrivate ? 'Publique' : 'Privée'}
              </p>
              <p className="text-sm mb-2">
                Statut: <span className="font-semibold">{statusText}</span>
              </p>
              <p className="text-xs text-gray-600">
                <strong>Date de début:</strong> {new Date(Number(election.startDate) * 1000).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">
                <strong>Date de fin:</strong> {new Date(Number(election.endDate) * 1000).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {isCreatePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Créer une nouvelle élection</h3>
            <form onSubmit={handleCreateElection} className="space-y-4">
              <input
                type="text"
                value={newElection.name}
                onChange={(e) => setNewElection({ ...newElection, name: e.target.value })}
                placeholder="Nom de l'élection"
                className="border rounded-lg px-4 py-2 w-full"
                required
              />

              <textarea
                value={newElection.description}
                onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                placeholder="Description"
                rows="3"
                className="border rounded-lg px-4 py-2 w-full resize-none"
                required
              ></textarea>

              <input
                type="datetime-local"
                value={newElection.startDate}
                onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                className="border rounded-lg px-4 py-2 w-full"
                required
              />

              <input
                type="datetime-local"
                value={newElection.endDate}
                onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                className="border rounded-lg px-4 py-2 w-full"
                required
              />

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={newElection.isPrivate}
                  onChange={() => setNewElection(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                  className="mr-2"
                />
                <label>Élection Privée</label>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold">Ajouter un candidat</h4>
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Nom du candidat"
                    className="border rounded-lg px-4 py-2"
                  />
                  <textarea
                    value={candidateProgram}
                    onChange={(e) => setCandidateProgram(e.target.value)}
                    placeholder="Programme du candidat"
                    rows="2"
                    className="border rounded-lg px-4 py-2 resize-none"
                  ></textarea>
                  <button
                    type="button"
                    onClick={handleAddCandidate}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Ajouter le candidat
                  </button>
                </div>
              </div>

              {newElection.candidates.length > 0 && (
                <ul className="space-y-2">
                  {newElection.candidates.map((candidate, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded-lg flex justify-between">
                      <span>{candidate.name} - {candidate.program}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewElection(prev => ({
                            ...prev,
                            candidates: prev.candidates.filter((_, i) => i !== index),
                          }))
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="border rounded-lg px-4 py-2 w-full"
              />

              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Créer
                </button>
                <button type="button" onClick={handleCloseCreatePopup} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailsPopupOpen && selectedElection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Détails de l'élection</h3>
            <p><strong>Nom:</strong> {selectedElection.name}</p>
            <p><strong>Type:</strong> {selectedElection.isPrivate ? 'Privée' : 'Publique'}</p>
            <p><strong>Statut:</strong> {selectedElection.votingSessionOpen ? 'En cours' : 'Fermée'}</p>
            <p><strong>Date de début:</strong> {new Date(selectedElection.startDate * 1000).toLocaleString()}</p>
            <p><strong>Date de fin:</strong> {new Date(selectedElection.endDate * 1000).toLocaleString()}</p>
            <p><strong>Description:</strong> {selectedElection.description}</p>

            <div className="mt-4">
              <h4 className="text-xl font-bold mb-2">Candidats</h4>
              {selectedElection.candidates.map((candidate, index) => (
                <div key={index} className="border rounded-lg p-4 mb-2">
                  <p><strong>Nom:</strong> {candidate.name}</p>
                  <p><strong>Programme:</strong> {candidate.program}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleCloseDetailsPopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSessionsContent;

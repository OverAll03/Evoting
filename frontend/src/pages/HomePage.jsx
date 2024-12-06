import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOngoingElections } from '../blockchainService';
import Header from '../components/unlogged/Header';
import Footer from '../components/unlogged/Footer';

const HomePage = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ongoingElections = await getOngoingElections();
        setElections(ongoingElections);
      } catch (error) {
        console.error("Erreur lors de la récupération des élections :", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleElectionClick = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-12 space-y-16">
        
        <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-8 rounded-lg text-white shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-4 animate__animated animate__fadeIn animate__delay-1s">
            Bienvenue sur la plateforme de vote de demain
          </h1>
          <p className="text-xl text-center animate__animated animate__fadeIn animate__delay-2s">
            Découvrez une nouvelle manière de participer aux élections en toute sécurité grâce à la blockchain.
          </p>
        </section>
        <section>
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Élections à venir</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader bg-blue-600 text-white p-3 rounded-full text-lg">Chargement...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {elections.length === 0 ? (
                <p className="text-lg text-center text-gray-700 col-span-3">Aucune élection à venir pour le moment.</p>
              ) : (
                elections.map(election => (
                  <div
                    key={election.id}
                    className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={() => handleElectionClick(election.id)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{election.name}</h3>
                    <p className="text-gray-600">Début : {new Date(election.startDate * 1000).toLocaleDateString()}</p>
                    <p className="text-gray-600">Fin : {new Date(election.endDate * 1000).toLocaleDateString()}</p>
                    <p className="text-gray-600">Type : {election.isPrivate ? 'Privée' : 'Publique'}</p>
                  </div>
                ))
              )}
              {/* Placeholders */}
              {elections.length === 0 && (
                <>
                  <div className="bg-white p-6 border rounded-lg shadow-lg animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  </div>
                  <div className="bg-white p-6 border rounded-lg shadow-lg animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  </div>
                  <div className="bg-white p-6 border rounded-lg shadow-lg animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <section className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Comment ça fonctionne ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/clipboard.svg" alt="Icon 1" className="mx-auto mb-4 h-16 w-16" />
              <h3 className="font-semibold text-gray-800 mb-2">Sélectionnez une élection</h3>
              <p className="text-gray-600">Choisissez parmi les élections en cours ou à venir.</p>
            </div>
            <div className="text-center">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/idcard.svg" alt="Icon 2" className="mx-auto mb-4 h-16 w-16" />
              <h3 className="font-semibold text-gray-800 mb-2">Identifiez-vous</h3>
              <p className="text-gray-600">Entrez vos informations pour valider votre identité.</p>
            </div>
            <div className="text-center">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/lock.svg" alt="Icon 3" className="mx-auto mb-4 h-16 w-16" />
              <h3 className="font-semibold text-gray-800 mb-2">Votez en toute sécurité</h3>
              <p className="text-gray-600">Utilisez la blockchain pour un vote sécurisé et transparent.</p>
            </div>
          </div>
        </section>
        
      </div>
      <Footer />
    </>
  );
};

export default HomePage;

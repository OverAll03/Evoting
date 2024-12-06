import React, { useEffect, useState } from 'react';
import { getOngoingElections } from '../../blockchainService'; 
import { useNavigate } from 'react-router-dom'; 

const OngoingElections = () => {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOngoingElections = async () => {
      try {
        const ongoingElections = await getOngoingElections();
        setElections(ongoingElections);
        console.log(ongoingElections);
      } catch (error) {
        console.error("Erreur lors de la récupération des élections en cours :", error);
      }
    };

    fetchOngoingElections();
  }, []);

  const handleElectionClick = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-2xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 tracking-wide">
        Élections en cours
      </h2>
      {elections.length === 0 ? (
        <p className="text-lg text-center text-gray-700">
          Aucune élection en cours pour le moment.
        </p>
      ) : (
        <ul className="space-y-6">
          {elections.map(election => (
            <li
              key={election.id}
              onClick={() => handleElectionClick(election.id)}
              className="p-6 border border-gray-200 rounded-lg shadow-lg bg-gradient-to-r from-white via-blue-50 to-blue-100 cursor-pointer hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {election.name}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  Cliquez pour voter !
                </p>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Date de début : {new Date(election.startDate * 1000).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Date de fin : {new Date(election.endDate * 1000).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OngoingElections;

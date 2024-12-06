import React, { useEffect, useState } from 'react';
import { getOngoingElections, getElections } from '../../blockchainService';

const DashboardContent = () => {
  const [ongoingSessions, setOngoingSessions] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalElections, setTotalElections] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const elections = await getElections();
        const ongoing = await getOngoingElections();
        setOngoingSessions(ongoing.length);
        const completed = elections.filter(election => Date.now() / 1000 > election.endDate);
        setCompletedSessions(completed.length);
        //const voters = elections.reduce((acc, election) => acc + election.voters.length, 0);
        setTotalElections(elections.length);
        console.log(elections.length)
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-4">Chargement des données...</p>;
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Sessions en cours" value={ongoingSessions} color="bg-blue-100" textColor="text-blue-800" />
        <StatCard title="Total des Elections" value={totalElections} color="bg-green-100" textColor="text-green-800" />
        <StatCard title="Sessions terminées" value={completedSessions} color="bg-yellow-100" textColor="text-yellow-800" />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ActionButton href="/results" text="Revue des résultats" color="bg-green-600" hoverColor="bg-green-700" />
          <ActionButton href="/vote" text="Voter" color="bg-yellow-400" hoverColor="bg-yellow-700" />
          <ActionButton href="/create-election" text="Créer une élection" color="bg-blue-600" hoverColor="bg-blue-700" />
        </div>
      </div>

      <RecentActivities />
    </div>
  );
};

const StatCard = ({ title, value, color, textColor }) => (
  <div className={`${color} p-6 rounded-lg shadow-md`}>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className={`${textColor} text-4xl font-bold`}>{value}</p>
  </div>
);

const ActionButton = ({ href, text, color, hoverColor }) => (
  <a href={href} className={`${color} text-white p-4 rounded-lg text-center hover:${hoverColor} transition-colors font-semibold`}>
    {text}
  </a>
);

const RecentActivities = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Activités Récentes</h2>
    <ul className="space-y-4 bg-white rounded-lg shadow-md p-6">
      <ActivityItem color="blue" title="Nouvelle session de vote créée" description="Une nouvelle session de vote a été créée." />
      <ActivityItem color="yellow" title="Vote soumis" description="Un vote a été soumis avec succès." />
      <ActivityItem color="green" title="Paramètres mis à jour" description="Les paramètres de l'élection ont été mis à jour." />
    </ul>
  </div>
);

const ActivityItem = ({ color, title, description }) => (
  <li className="border-b last:border-b-0 pb-4 last:pb-0">
    <p className="font-medium">{title}</p>
    <p className="text-gray-600">{description}</p>
  </li>
);

export default DashboardContent;

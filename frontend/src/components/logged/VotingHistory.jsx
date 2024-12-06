import React from 'react';

const VotingHistory = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Voting History</h3>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Election</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Candidate</th>
            <th className="px-4 py-2">Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Presidential Election</td>
            <td className="border px-4 py-2">2024-11-05</td>
            <td className="border px-4 py-2">Jane Smith</td>
            <td className="border px-4 py-2">0xabc...def</td>
          </tr>
          {/* Repeat rows for more records */}
        </tbody>
      </table>
    </div>
  );
};

export default VotingHistory;

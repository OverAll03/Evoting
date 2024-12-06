import React from 'react';

const SecuritySettings = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
      <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full mb-4">
        Enable 2FA
      </button>
      <form>
        <label className="block text-gray-700">Change Password:</label>
        <input type="password" placeholder="New Password" className="w-full mt-2 p-2 border rounded-lg" />
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default SecuritySettings;

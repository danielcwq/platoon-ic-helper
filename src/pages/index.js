import { useState, useEffect } from 'react';
import StatusForm from './StatusForm';
import StatusList from './StatusList';

export default function Index() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const storedStatuses = localStorage.getItem('statuses');
    if (storedStatuses) {
      setStatuses(JSON.parse(storedStatuses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('statuses', JSON.stringify(statuses));
  }, [statuses]);

  const addStatus = (status) => {
    setStatuses([...statuses, status]);
  };

  const removeExpiredStatuses = () => {
    const today = new Date().toISOString().split('T')[0];
    setStatuses((prevStatuses) =>
      prevStatuses.filter((status) => status.endDate >= today)
    );
  };

  useEffect(() => {
    removeExpiredStatuses();
    const timer = setInterval(removeExpiredStatuses, 60 * 1000); // Run every minute

    return () => clearInterval(timer);
  }, []);

  const removeStatus = (id) => {
    setStatuses(statuses.filter((status) => status.id !== id));
  };

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to reset? This will delete all data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Status Management</h1>
        <p>Please do RMJ first if not this system will bug out.</p>
        <StatusForm addStatus={addStatus} />
        <StatusList statuses={statuses} removeStatus={removeStatus} />
        <button
          onClick={handleResetClick}
          className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 mt-4"
        >
          Reset Data
        </button>
      </div>
    </div>
  );
}

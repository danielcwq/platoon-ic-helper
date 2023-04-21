import Image from 'next/image'
import { Inter } from 'next/font/google'
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

    // Inside Index() component

    const removeStatus = (id) => {
      setStatuses(statuses.filter((status) => status.id !== id));
    };

    // Pass this function to StatusList component
    <StatusList statuses={statuses} removeStatus={removeStatus} />


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Status Management</h1>
          <p> Please do RMJ first if not this system will bug out.</p>
        <StatusForm addStatus={addStatus} />
        <StatusList statuses={statuses} removeStatus = {removeStatus}/>
      </div>
    </div>

  )
}

import { useState } from 'react';

const CONDITIONS = ['RMJ', 'MC', 'RSO', 'LD', 'UFD', 'Report Sick']

const StatusForm = ({ addStatus }) => {
    const [id, setId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [condition, setCondition] = useState('RMJ');
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newStatus = {
            id,
            condition,
            startDate,
            endDate,
            reason: condition === 'Report Sick' ? reason : '',
        };

        addStatus(newStatus);
        setId('');
        setCondition('');
        setStartDate('');
        setEndDate('');
        setReason('');
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="block w-full py-2 px-4 bg-white border border-gray-300 rounded-md"
            />
            <input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="block w-full py-2 px-4 bg-white border border-gray-300 rounded-md"
            />
            <input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="block w-full py-2 px-4 bg-white border border-gray-300 rounded-md"
            />
            <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="block w-full py-2 px-4 bg-white border border-gray-300 rounded-md"
            >
                <option value="RMJ">RMJ</option>
                <option value="Report Sick">Report Sick</option>
                <option value="UFD">UFD</option>
                <option value="LD">LD</option>
            </select>
            {condition === 'Report Sick' && (
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Reason
        </label>
                    <input
                        type="text"
                        name="reason"
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            )}
            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
                Add Status
      </button>

        </form>
    );
};
export default StatusForm;

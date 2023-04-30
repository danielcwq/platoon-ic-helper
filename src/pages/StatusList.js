import React from 'react';


const StatusList = ({ statuses, removeStatus }) => {
  if (!statuses) {
    return <div>Loading...</div>;
  }

  const padWithZero = (number) => number.toString().padStart(2, '0');

  const formatDateString = (date) => {
    const d = new Date(date);
    return `${padWithZero(d.getDate())}${padWithZero(d.getMonth() + 1)}${d.getFullYear() % 100}`;
  };

  const formatStatus = (status, showId = false) => {
    const { id, condition, startDate, endDate, reason } = status;
    const startDateFormatted = startDate ? formatDateString(startDate) : '';
    const endDateFormatted = endDate ? formatDateString(endDate) : '';
    const days = endDate && startDate
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
      : '';

    if (condition === 'Report Sick') {
      return `${id} - ${reason}`;
    } else {
      const idDisplay = showId ? `${id} - ` : '';
      const conditionDisplay = condition && days ? `${days}D ${condition}` : condition;
      const datesDisplay = startDateFormatted && endDateFormatted
        ? ` (${startDateFormatted}-${endDateFormatted})`
        : '';
      return `${idDisplay}${conditionDisplay}${datesDisplay}`;
    }
  };

  const getStatusSummary = (condition, label) => {
    const filteredStatuses = statuses.filter((status) => status.condition === condition);
    const count = filteredStatuses.length;
    const summary = count > 0
      ? `${label}: ${padWithZero(count)}\n${filteredStatuses.map(formatStatus).join('\n')}\n\n`
      : '';
    return { count, summary };
  };

  const totalStrength = 63;
  const { count: ufdCount, summary: ufdSummary } = getStatusSummary('UFD', 'UFD');
  const { count: rmjCount, summary: rmjSummary } = getStatusSummary('RMJ', 'RMJ');
  const { count: ldCount, summary: ldSummary } = getStatusSummary('LD', 'LD');
  const { count: reportSickCount, summary: reportSickSummary } = getStatusSummary('Report Sick', 'REPORT SICK');

  const currentStrength = totalStrength - ufdCount;
  const participatingStrength = totalStrength - ufdCount - rmjCount - ldCount - reportSickCount;
  const strengthsSummary = `Current Strength : ${padWithZero(currentStrength)}/${totalStrength}\nParticipating Strength: ${padWithZero(participatingStrength)}/${totalStrength}\n\n`;

  const handleRemoveButtonClick = (id) => {
    removeStatus(id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Strength</h2>
      <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">{strengthsSummary}</pre>
      <h2 className="text-lg font-bold">UFD</h2>
      <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">{ufdSummary}</pre>
      
      <h2 className="text-lg font-bold">Report Sick</h2>
      <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">{reportSickSummary}</pre>
      <h2 className="text-lg font-bold">Full Statuses</h2>
      {statuses.map((status) => (
        <div key={status.id} className="flex items-center space-x-2">
          <span>{formatStatus(status, true)}</span>
          <button
            onClick={() => handleRemoveButtonClick(status.id)}
            className="bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 px-2 py-1"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
  };
  
  export default StatusList;
  

const StatusList = ({ statuses, removeStatus}) => {
    if (!statuses) {
        return <div>Loading...</div>;
    }

    const formatDateString = (date) => {
       const d = new Date(date);
        return ('0' + d.getDate()).slice(-2) + ('0' + (d.getMonth() + 1)).slice(-2) + (d.getFullYear() % 100);
    };
   
    


    const formatStatus = (status, showId = true) => {
        const { id, condition, startDate, endDate, reason } = status;
        const startDateFormatted = startDate ? formatDateString(startDate) : '';
        const endDateFormatted = endDate ? formatDateString(endDate) : '';
        const days = endDate && startDate ? Math.ceil((new Date (endDate) - new Date (startDate)) / (1000 * 60 * 60 * 24)) + 1 : '';
      
        if (condition === 'Report Sick') {
            return `${id} - ${reason}`;
        } else {
            const idDisplay = showId ? `${id} - ` : '';
            const conditionDisplay = condition !== 'UFD' ? `${days}D ${condition}` : `${days}D ${condition} (${startDateFormatted}-${endDateFormatted})`;
            const datesDisplay = ` (${startDateFormatted}-${endDateFormatted})`; // Add this line to show the dates for all conditions
            return (
                `${idDisplay}${conditionDisplay}${datesDisplay}` + // Include the datesDisplay variable here
                (status.additionalCondition ? ` + ${days}D ${status.additionalCondition} (${startDateFormatted}-${endDateFormatted})` : '')
            );
        }
    };
    
    
    
    

    const ufdStatuses = statuses.filter((status) => status.condition === 'UFD');
    const padWithZero = (number) => number.toString().padStart(2, '0');

    const ufdSummary =
    ufdStatuses.length > 0
        ? `UFD : ${padWithZero(ufdStatuses.length)}\n${ufdStatuses.map((status) => formatStatus(status, true)).join('\n')}\n\n`
        : '';


    const totalStrength = 63;
    const ufdCount = statuses.filter((status) => status.condition === 'UFD').length;
    const rmjCount = statuses.filter((status) => status.condition === 'RMJ').length;
    const ldCount = statuses.filter((status) => status.condition === 'LD').length;
    const reportSickStatuses = statuses.filter((status) => status.condition === 'Report Sick');
    const reportSickCount = reportSickStatuses.length;
    const currentStrength = totalStrength - ufdCount;




    const groupedStatuses = statuses.reduce((groups, status) => {
        if (status.condition !== 'UFD') {
            const key = `${status.id}-${status.condition}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(status);
        }
        return groups;
    }, {});

    const formattedStatuses = Object.values(groupedStatuses)
        .map((statusGroup) => {
            const formattedGroup = statusGroup
                .map((status, index) => {
                    const formattedStatus = formatStatus(status, index === 0);
                    return index === 0 ? formattedStatus : ` + ${formattedStatus}`;
                })
                .join('');
            return formattedGroup;
        })
        .join('\n');


    
        const reportSickSummary =
        reportSickCount > 0
          ? `REPORT SICK: ${padWithZero(reportSickCount)}\n${reportSickStatuses
              .map(
                (status) =>
                  `${status.id} - ${status.reason} ` +
                  `<button data-id="${status.id}" class="bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 px-2 py-1">Remove</button>`
              )
              .join('\n')}\n\n`
          : '';

          // Inside StatusList component

const handleRemoveButtonClick = (e) => {
    if (e.target.tagName === "BUTTON") {
      const id = e.target.dataset.id;
      removeStatus(id);
    }
  };
  
  const combineStatusEntries = (formattedStatuses) => {
    const combinedStatuses = {};

    formattedStatuses.forEach((status) => {
      const [id, condition] = status.split(' - ');

      if (!combinedStatuses[id]) {
        combinedStatuses[id] = [];
      }

      combinedStatuses[id].push(condition);
    });

    return Object.entries(combinedStatuses).map(
      ([id, conditions]) => `${id} - ${conditions.join(' + ')}`
    );
  };

  const ldAndRmjStatuses = statuses.filter(
    (status) => status.condition === 'LD' || status.condition === 'RMJ'
  );

  const formattedLdAndRmjStatuses = ldAndRmjStatuses.map((status) =>
    formatStatus(status)
  );

  const combinedLdAndRmjStatuses = combineStatusEntries(formattedLdAndRmjStatuses);
  const ldAndRmjIdSet = new Set(ldAndRmjStatuses.map((status) => status.id));
  const participatingStrength = totalStrength - ufdCount - ldAndRmjIdSet.size - reportSickCount;
  const strengthsSummary = `Current Strength : ${padWithZero(currentStrength)}/${totalStrength}\nParticipating Strength: ${padWithZero(participatingStrength)}/${totalStrength}\n\n`;

  const copyToClipboard = () => {
    const contentToCopy = `${strengthsSummary}${ufdSummary}${reportSickSummary}STATUSES: ${padWithZero(ldCount + rmjCount)}\n${combinedLdAndRmjStatuses.join('\n')}`;
    navigator.clipboard.writeText(contentToCopy).then(
      () => alert('Statuses copied to clipboard!'),
      (err) => console.error('Could not copy text: ', err)
    );
  };
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Strength</h2>
            <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">{strengthsSummary}</pre>
            <h2 className="text-lg font-bold">UFD</h2>
            <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">{ufdSummary}</pre>
            <h2 className="text-lg font-bold">STATUSES</h2>
            <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">
        {combinedLdAndRmjStatuses.join('\n')}
      </pre>
            <h2 className="text-lg font-bold">Report Sick</h2>
            <pre
  className="whitespace-pre-wrap break-words"
  onClick={handleRemoveButtonClick}
  dangerouslySetInnerHTML={{ __html: reportSickSummary }}
/>
            <button
                onClick={copyToClipboard}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
                Copy to Clipboard
        </button>
        </div>
    );
};

export default StatusList;

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
        const days = endDate && startDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 : '';
      
        if (condition === 'Report Sick') {
          return `${id} - ${reason}`;
        } else {
          const idDisplay = showId ? `${id} - ` : '';
          const conditionDisplay = condition !== 'UFD' ? `${days}D ${condition}` : `${days}D ${condition}`;
          const datesDisplay = ` (${startDateFormatted}-${endDateFormatted})`;
          return (
            `${idDisplay}${conditionDisplay}${datesDisplay}` +
            (status.additionalCondition ? ` + ${days}D ${status.additionalCondition}` : '')
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

 // const ldAndRmjStatuses = statuses.filter(
 //   (status) => status.condition === 'LD' || status.condition === 'RMJ'
 // );

 
  const countUniqueIdsWithConditions = (conditions) => {
    const uniqueIds = new Set(
      statuses
        .filter((status) => conditions.includes(status.condition))
        .map((status) => status.id)
    );
    return uniqueIds.size;
  };

  const getUniqueIds = (statuses) => {
    const idSet = new Set();
    statuses.forEach((status) => idSet.add(status.id));
    return [...idSet];
  };
  

  

  const ufdUniqueIds = getUniqueIds(ufdStatuses);
const ldAndRmjUniqueIds = getUniqueIds(statuses.filter((status) => status.condition === 'LD' || status.condition === 'RMJ'));
const reportSickUniqueIds = getUniqueIds(reportSickStatuses);

const ldAndRmjStatuses = statuses.filter((status) => status.condition === 'LD' || status.condition === 'RMJ');
const formattedLdAndRmjStatuses = ldAndRmjStatuses.map((status) =>
formatStatus(status)
);
const ldAndRmjUniqueIDs = new Set(ldAndRmjStatuses.map((status) => status.id));
const participatingStrength = totalStrength - ldAndRmjUniqueIDs.size - ufdCount - reportSickCount;


//const participatingStrength = totalStrength - ufdUniqueIds.length - reportSickUniqueIds.length - ldAndRmjUniqueIds.length;

  const combinedLdAndRmjStatuses = combineStatusEntries(formattedLdAndRmjStatuses);
  const ldAndRmjIdSet = new Set(ldAndRmjStatuses.map((status) => status.id));
  const ldAndRmjCount = countUniqueIdsWithConditions(['LD', 'RMJ']);
  const strengthsSummary = `Current Strength : ${padWithZero(currentStrength)}/${totalStrength}\nParticipating Strength: ${padWithZero(participatingStrength)}/${totalStrength}\n\n`;

  const copyToClipboard = () => {
    const today = new Date();
    const formattedToday = `${padWithZero(today.getDate())}${padWithZero(today.getMonth() + 1)}${today.getFullYear().toString().substr(-2)}`;
  
    const ufdIds = new Set(ufdStatuses.map((status) => status.id));
    const ldAndRmjIds = new Set(ldAndRmjStatuses.map((status) => status.id));
    const reportSickIds = new Set(reportSickStatuses.map((status) => status.id));
    const allUniqueIds = new Set([...ufdIds, ...ldAndRmjIds, ...reportSickIds]);
    const participatingStrengthUnique = totalStrength - allUniqueIds.size;
  
    const strengthsSummaryUnique = `Current Strength : ${padWithZero(currentStrength)}/${totalStrength}\nParticipating Strength: ${padWithZero(participatingStrengthUnique)}/${totalStrength}\n\n`;
  
    const contentToCopy = `Platoon 1 Activity Str for ${formattedToday}\n\n${strengthsSummaryUnique}${ufdSummary}STATUSES: ${padWithZero(ldCount + rmjCount)}\n${combinedLdAndRmjStatuses.join('\n')}\n\nREPORT SICK\n${reportSickSummary}\nOTHERS\n`;
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

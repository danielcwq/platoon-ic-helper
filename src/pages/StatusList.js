const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const StatusList = ({ statuses }) => {
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
        const days = endDate && startDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : '';

        if (condition === 'Report Sick') {
            return `${id} - ${reason}`;
        } else if (condition === 'UFD') {
            return `${id} - ${days}D ${condition} (${startDateFormatted}-${endDateFormatted})`;
        } else {
            return (
                `${id} - ${days}D ${condition} (${startDateFormatted}-${endDateFormatted})` +
                (status.additionalCondition ? ` + ${days}D ${status.additionalCondition} (${startDateFormatted}-${endDateFormatted})` : '')
            );
        }
    };


    const ufdStatuses = statuses.filter((status) => status.condition === 'UFD');
    const padWithZero = (number) => number.toString().padStart(2, '0');

    const ufdSummary =
        ufdStatuses.length > 0
            ? `UFD : ${padWithZero(ufdStatuses.length)}\n${ufdStatuses.map((status) => formatStatus(status)).join('\n')}\n\n`
            : '';


    const totalStrength = 63;
    const ufdCount = statuses.filter((status) => status.condition === 'UFD').length;
    const rmjCount = statuses.filter((status) => status.condition === 'RMJ').length;
    const ldCount = statuses.filter((status) => status.condition === 'LD').length;
    const currentStrength = totalStrength - ufdCount;
    const participatingStrength = currentStrength - ldCount;


    const strengthsSummary = `Current Strength : ${padWithZero(currentStrength)}/${totalStrength}\nParticipating Strength: ${padWithZero(participatingStrength)}/${totalStrength}\n\n`;

    const groupedStatuses = statuses.reduce((groups, status) => {
        if (status.condition !== 'UFD') {
            if (!groups[status.id]) {
                groups[status.id] = [];
            }
            groups[status.id].push(status);
        }
        return groups;
    }, {});

    const formattedStatuses = Object.values(groupedStatuses)
        .map((statusGroup) => {
            const formattedGroup = statusGroup
                .map((status, index) => formatStatus(status, index === 0))
                .join(' + ');
            return formattedGroup;
        })
        .join('\n');

    const reportSickStatuses = statuses.filter((status) => status.condition === 'Report Sick');
    const reportSickCount = reportSickStatuses.length;
    const reportSickSummary =
        reportSickCount > 0
            ? `REPORT SICK: ${padWithZero(reportSickCount)}\n${reportSickStatuses
                .map((status) => `${status.id} - ${status.reason}`)
                .join('\n')}\n\n`
            : '';
    const copyToClipboard = () => {
        const contentToCopy = `${strengthsSummary}${ufdSummary}${reportSickSummary}STATUSES: ${padWithZero(ldCount + rmjCount)}\n${formattedStatuses}`;
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
            <pre className="whitespace-pre-wrap break-all bg-white p-4 border border-gray-300 rounded-md">{formattedStatuses}</pre>
            <h2 className="text-lg font-bold">Report Sick</h2>
            <pre className="whitespace-pre-wrap break-words">{reportSickSummary}</pre>
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

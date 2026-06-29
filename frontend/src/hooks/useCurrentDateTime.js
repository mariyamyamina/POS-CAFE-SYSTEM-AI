import { useEffect, useState } from 'react';

const formatDateTime = (date) => ({
  dateLabel: new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date),
  dayLabel: new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(date),
  timeLabel: new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date),
});

const useCurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(() => formatDateTime(new Date()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(formatDateTime(new Date()));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return currentDateTime;
};

export default useCurrentDateTime;

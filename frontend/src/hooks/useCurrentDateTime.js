import { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const formatDateTime = (date, timeFormat = 'hh:mm A') => {
  const is12Hour = timeFormat === 'hh:mm A';
  
  return {
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
      hour12: is12Hour,
    }).format(date),
  };
};

const useCurrentDateTime = () => {
  const { settings } = useSettings();
  const [currentDateTime, setCurrentDateTime] = useState(() => formatDateTime(new Date(), settings.time_format));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(formatDateTime(new Date(), settings.time_format));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [settings.time_format]);

  return currentDateTime;
};

export default useCurrentDateTime;

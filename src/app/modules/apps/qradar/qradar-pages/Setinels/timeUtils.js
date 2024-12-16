// Function to convert time from 12-hour format to 24-hour format
export const convertTo24HourFormat = (time) => {
    const [hourMinute, period] = time.split(' ');
    let [hours, minutes] = hourMinute.split(':').map(Number);
  
    if (period?.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    }
    if (period?.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Function to convert time from 24-hour format to 12-hour format
  export const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const hour = hours % 12 || 12;
  
    return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
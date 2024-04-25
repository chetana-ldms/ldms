import { useState } from 'react';

const moment = require('moment-timezone');

export const getCurrentTimeZone =(UTCDate) =>{
    const inputTime = moment.tz(UTCDate, "UTC"); // Assuming the input time is in UTC
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;   // to get current time zone
    const indianTime = inputTime.tz(userTimeZone); // Convert to current TimeZone time
    
    const formattedDateTime = indianTime.format("MM/DD/YYYY h:mm A");
    return formattedDateTime
  }
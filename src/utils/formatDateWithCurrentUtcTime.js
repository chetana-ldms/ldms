// src/utils/useUtcDateFormatter.js

const formatDateWithCurrentUtcTime = (dateStr) => {
  const dateOnly = new Date(dateStr)
  const nowUtc = new Date()

  dateOnly.setUTCHours(nowUtc.getUTCHours())
  dateOnly.setUTCMinutes(nowUtc.getUTCMinutes())
  dateOnly.setUTCSeconds(nowUtc.getUTCSeconds())
  dateOnly.setUTCMilliseconds(nowUtc.getUTCMilliseconds())

  return dateOnly.toISOString()
}

export default formatDateWithCurrentUtcTime

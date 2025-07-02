export function getCityDate(weather: { timezone: number }, baseTimestamp?: number) {
  // baseTimestamp: seconds since epoch (UTC), e.g. for sunrise/sunset
  // If not provided, use current UTC time
  const utcMillis = (typeof baseTimestamp === 'number' ? baseTimestamp * 1000 : Date.now());
  // weather.timezone is in seconds, convert to ms
  return new Date(utcMillis + (weather.timezone * 1000));
} 
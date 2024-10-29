import { fetchrefreshToken } from "../../api/Api";


const FetchWithToken = async (url, options = {}) => {
  const token = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  const userName = sessionStorage.getItem('userName');

  // Add token and userName to headers
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Make the initial API request
  let response = await fetch(url, options);

  // If the token is expired, attempt to refresh it
  if (response.status === 401) {
    console.warn('Access token expired, refreshing...');

    try {
      const refreshData = await fetchrefreshToken(refreshToken, userName);

      if (refreshData && refreshData.accessToken) {
        // Store the new access token in session storage
        sessionStorage.setItem('accessToken', refreshData.accessToken);
        sessionStorage.setItem('refreshToken', refreshData.refreshToken);

        // Retry the original request with the new token
        options.headers.Authorization = `Bearer ${refreshData.accessToken}`;
        response = await fetch(url, options);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      sessionStorage.clear(); // Clear session on failure
      window.location.href = '/ldms/auth'; // Redirect to login
    }
  }

  return response;
};

export default FetchWithToken;

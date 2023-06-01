import { graphConfig } from './authConfig';

export const sendMessageToChannel = async (token, teamId, channelId, message) => {
  const endpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        body: {
          content: message,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    throw new Error(`Error sending message: ${error.message}`);
  }
};

export const callMsGraph = async (accessToken) => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to call MS Graph API: ${response.status} ${response.statusText}`);
  }
};



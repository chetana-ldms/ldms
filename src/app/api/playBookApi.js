const PlayBooks="http://115.110.192.133:8011/api/PlayBook/v1/PlayBooks"


export const fetchPlayBooks = async (orgId) => {
    try {
      const response = await fetch(`${PlayBooks}?orgId=${orgId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const playbooks = responseData.playbooks;
      console.log(playbooks, "playbooks");
      return playbooks;
    } catch (error) {
      console.log(error);
    }
  };
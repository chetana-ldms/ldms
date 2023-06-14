const PlayBooks="http://115.110.192.133:8011/api/PlayBook/v1/PlayBooks"
const Delete="http://115.110.192.133:8011/api/PlayBook/v1/Playbook/Delete"
const PlaybookByID="http://115.110.192.133:8011/api/PlayBook/v1/PlaybookByID"

export const fetchDelete = async (data) => {
    try {
      const response = await fetch(`${Delete}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data
        }),
      });
    
      const responseData = await response.json();
      console.log(responseData, "responseData111")
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
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
  export const fetchPlaybookByID = async (id, toolNameRef, remarksRef) => {
    try {
      const response = await fetch(`${PlaybookByID}?PlaybookID=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const playbooks = responseData.playbooks;
      console.log(playbooks, "playbooks"); 
      // Populate the form fields with the retrieved data
      toolNameRef.current.value = playbooks[0].playBookName;
      remarksRef.current.value = playbooks[0].remarks;
      return playbooks;
    } catch (error) {
      console.log(error);
    }
  };
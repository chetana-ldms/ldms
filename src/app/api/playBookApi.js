const playBooksUrl = process.env.REACT_APP_PLAYBOOKS_URL;
const deletePlaybookUrl = process.env.REACT_APP_DELETE_PLAYBOOK_URL;
const playbookByIdUrl = process.env.REACT_APP_PLAYBOOK_BY_ID_URL;

export const fetchDelete = async (data) => {
  try {
    const response = await fetch(`${deletePlaybookUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData111");
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchPlayBooks = async (orgId) => {
  try {
    const response = await fetch(`${playBooksUrl}?orgId=${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch(`${playbookByIdUrl}?PlaybookID=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

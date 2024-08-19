import { toast } from 'react-toastify';
import { copyToClipboard } from './clipboardUtils'; // Import the copy utility function

export const notify = (message) => {
  const notificationId = toast.success(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{message}</span>
      <i 
        className="bi bi-clipboard" 
        onClick={() => copyToClipboard(message)} 
        style={{ marginLeft: '10px', fontSize: '1.2em', color: 'white', cursor: 'pointer' }}
      />
    </div>, 
    {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    }
  );

  return notificationId;
};

export const notifyFail = (message) => {
  const notificationId = toast.error(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{message}</span>
      <i 
        className="bi bi-clipboard" 
        onClick={() => copyToClipboard(message)} 
        style={{ marginLeft: '10px', fontSize: '1.2em', color: 'white', cursor: 'pointer' }}
      />
    </div>, 
    {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    }
  );

  return notificationId;
};

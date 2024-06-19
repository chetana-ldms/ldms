import React, { useEffect, useState, useCallback, useRef } from 'react';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 1 minute in milliseconds

const IdleTimeoutManager = () => {
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const idleTimeoutRef = useRef(null);

  // Function to logout user
  const logoutUser = useCallback(() => {
    sessionStorage.clear(); // Clear session storage
    window.location.replace('/ldms/auth'); // Redirect to login page
  }, []);

  // Function to reset idle timeout
  const resetIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(logoutUser, IDLE_TIMEOUT);
  }, [logoutUser]);

  // Function to handle user activity
  const handleUserActivity = useCallback(() => {
    setLastActiveTime(Date.now()); // Update last active time
    resetIdleTimeout(); // Reset idle timeout on activity
  }, [resetIdleTimeout]);

  useEffect(() => {
    // Initial setup
    resetIdleTimeout();

    // Event listeners for user activity
    const events = ['mousemove', 'keydown', 'mousedown', 'click']; // Add more events as needed
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup function to remove event listeners
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity, resetIdleTimeout]);

  return null; // No UI component needed for this, logic is handled internally
};

export default IdleTimeoutManager;

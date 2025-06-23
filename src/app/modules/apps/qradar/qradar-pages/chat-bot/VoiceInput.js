import React, { useEffect, useRef } from 'react';

const VoiceInput = ({ setQuery, onVoiceComplete }) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        if (onVoiceComplete) {
          onVoiceComplete(transcript); // Pass transcript to parent
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  }, [setQuery, onVoiceComplete]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  return (
    <button onClick={startListening} className="btn btn-secondary" type="button" title="Speak">
      <i className="bi bi-mic-fill"></i>
    </button>
  );
};

export default VoiceInput;
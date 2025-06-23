import React from 'react';

export const speak = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US';
  window.speechSynthesis.speak(speech);
};

export default speak;
import React, { useEffect } from 'react';

const ButtonWithSound = () => {
  let audioContext: AudioContext | null = null;
  let audioBuffer: AudioBuffer | null = null;

  // Load the audio file and decode it
  const loadAudio = async () => {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch('app/CyberTaxiDashboard/Assets/click.mp3'); // Ensure the file is in the `public` folder
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  };

  // Play the audio
  const playSound = () => {
    if (!audioContext || !audioBuffer) return;
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  };

  useEffect(() => {
    loadAudio();
  }, []);

  return (
    <button
      onClick={playSound}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      Click Me
    </button>
  );
};

export default ButtonWithSound;

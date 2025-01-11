import { useEffect, useState } from 'react'
export default function Audio() {
  const playlist = require('../public/audio/chlorine.mp3');
  const [audioElement, setAudioElement] = useState(null);
  const [playButton, setPlayButton] = useState(null);
  useEffect(() => {
    setAudioElement(document.querySelector("#myAudio"));
    setPlayButton(document.querySelector('#playAudio'));
  }, []);
  const handleAudio = () => {
    if (!playButton.classList.contains('isPlaying')) {
      playButton.classList.add('isPlaying');
      audioElement.setAttribute('src', playlist);
      audioElement.play();
    } else {
      audioElement.pause();
      playButton.classList.remove('isPlaying');
    }
  }
  return (
    <div className="main">
      <audio id="myAudio">
        Your browser does not support the audio element.
      </audio>
      <p>Click the button to play or pause the audio.</p>
      <button className="btn" id="playAudio" onClick={handleAudio} type="button">Play Audio</button>
    </div>
  )
}
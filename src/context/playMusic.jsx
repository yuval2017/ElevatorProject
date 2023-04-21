import React, { useState, useRef, createContext } from 'react';

const AudioPlayerContext = createContext();

function AudioPlayerProvider(props) {
  const {path} = props;
  const [audioPath, setAudioPath] = useState(path);
  const audioRef = useRef(null);
  function playAudio() {
    audioRef.current.play();
  }

  const value = {
    audioPath,
    setAudioPath,
    playAudio
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {props.children}
      <audio ref={audioRef} src={audioPath} />
    </AudioPlayerContext.Provider>
  );
}

function useAudioPlayer() {
  const context = React.useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}

export { AudioPlayerProvider, useAudioPlayer };

import React, { useState, useRef, createContext } from 'react';
import PropTypes from 'prop-types';

const AudioPlayerContext = createContext();

function AudioPlayerProvider({children, path}) {
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
      {children}
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
AudioPlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
};
export { AudioPlayerProvider, useAudioPlayer };

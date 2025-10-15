import { useEffect, useRef, useState } from 'react';

interface UseAudioStreamProps {
  url: string;
}

const useAudioStream = ({
  url,
}: UseAudioStreamProps): [boolean, () => Promise<void>] => {
  const [playing, setPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();

    const handleLoadedData = () => {
      audioRef.current = audio;
    };

    const handleEnded = () => {
      setPlaying(false);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);
    audio.src = url;

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlaying(false);
    };
  }, [url]);

  const toggle = async () => {
    if (!audioRef.current) return;

    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setPlaying(false);
    }
  };

  return [playing, toggle];
};

export default useAudioStream;

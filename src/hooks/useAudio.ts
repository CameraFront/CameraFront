import { useEffect, useState } from 'react';
import { audioMapper } from '@/types/mappers';

// 오디오를 재생하는 Custom Hook
const useAudio = (type: keyof typeof audioMapper): [boolean, () => void] => {
  const [audio] = useState(new Audio(audioMapper[type]));
  const [playing, setPlaying] = useState<boolean>(false);

  const toggle = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) audio.play();
    else audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};

export default useAudio;

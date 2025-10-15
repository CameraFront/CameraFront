import { Button } from 'antd';
import styled from 'styled-components';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import useAudioStream from '@/hooks/useAudioStream';
import { SETTINGS_PATH } from '@/services/api/apiPaths';

interface Props {
  audioKey: number;
  stopPropagation?: boolean;
}

const AudioPlayButton = ({ audioKey, stopPropagation = false }: Props) => {
  const audioUrl = `${
    import.meta.env.VITE_APP_API_BASE_URL +
    import.meta.env.VITE_APP_API_PREFIX +
    SETTINGS_PATH
  }/getAudioFileStream.do/${audioKey}`;
  const [playing, toggle] = useAudioStream({ url: audioUrl });

  const icon = playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />;
  const handleClick = async (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();

    await toggle();
  };

  return (
    <Wrapper type="text" onClick={handleClick}>
      {icon}
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  padding: 0 4px;
  height: auto;
  line-height: 1.2;
  font-size: ${themeGet('fontSizes.s5')};
`;

export default AudioPlayButton;

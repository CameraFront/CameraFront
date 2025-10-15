import { useMemo } from 'react';
import { useTheme } from 'styled-components';

const useEventColors = () => {
  const theme = useTheme();

  const eventColors = useMemo(
    () => [theme.colors.urgent, theme.colors.important, theme.colors.minor],
    [theme.colors],
  );
  return eventColors;
};

export default useEventColors;

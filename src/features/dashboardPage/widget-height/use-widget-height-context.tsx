import { useContext } from 'react';
import { WidgetHeightContext } from '.';

export const useWidgetHeightContext = () => {
  const context = useContext(WidgetHeightContext);
  if (context === undefined) {
    throw new Error(
      'useWidgetHeightContext는 WidgetHeightProvider 내부에서만 사용할 수 있습니다.'
    );
  }
  return context;
};

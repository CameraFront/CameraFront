import { memo } from 'react';
import { useAppSelector } from '@/app/hooks';
import EditModeOff from './EditModeOff';
import EditModeOn from './EditModeOn';

const Header = () => {
  const { isEditMode } = useAppSelector(store => store.topology);
  // 편집모드일 때는 EditModeOn 컴포넌트를, 아닐 때는 EditModeOff 컴포넌트를 렌더링
  if (isEditMode) return <EditModeOn />;

  return <EditModeOff />;
};

export default memo(Header);

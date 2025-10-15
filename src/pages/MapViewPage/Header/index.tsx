import { useAppSelector } from '@/app/hooks';
import EditModeOn from './EditModeOn';
import EditModeOff from './EditModeOff';

const Header = () => {
  const { isEditMode } = useAppSelector(store => store.railwayMap);

  // 편집모드일 때 EditModeOn 컴포넌트를, 아닐 때 EditModeOff 컴포넌트를 렌더링
  if (isEditMode) return <EditModeOn />;

  return <EditModeOff />;
};

export default Header;

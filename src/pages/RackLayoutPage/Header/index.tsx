import { useAppSelector } from '@/app/hooks';
import EditModeOn from './EditModeOn';
import EditModeOff from './EditModeOff';

const Header = () => {
  const { isEditMode } = useAppSelector(store => store.rackLayout);

  if (isEditMode) return <EditModeOn />;

  return <EditModeOff />;
};

export default Header;

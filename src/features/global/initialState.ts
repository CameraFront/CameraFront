import { GlobalState } from './types';

export const initialState: GlobalState = {
  isLoading: false,
  isDarkMode: false,
  isAudibleOn: false,
  isAlarmPopupOn: false,
  isAlarmOn: false,
  menuSider: {
    isCollapsed: true,
    selectedMenu: '',
  },
  isSettingsOpen: false,
  user: null,
};

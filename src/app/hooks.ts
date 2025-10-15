import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { AppDispatch, AppRootState } from './store';

// TypedUseSelectorHook을 사용하여 useSelector를 타입 안전하게 사용할 수 있도록 함
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

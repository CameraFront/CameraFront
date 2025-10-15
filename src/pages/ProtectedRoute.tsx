import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setUser } from '@/features/global/globalSlice';
import { getUserFromSessionStorage } from '@/utils/clientStorages';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(store => store.global);
  const userInStorage = getUserFromSessionStorage();

  // 세션스토리지에 로그인 정보가 없으면 로그인 페이지로 이동
  if (!userInStorage) return <Navigate to="/signin" />;

  // 세션스토리지에 로그인 정보가 있으면 store에 저장
  if (!user) dispatch(setUser(userInStorage));

  return children;
};

export default ProtectedRoute;

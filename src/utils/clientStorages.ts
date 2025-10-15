import { GlobalState } from '@/features/global/types';

export const addUserSessionStorage = (user: GlobalState['user']) => {
  sessionStorage.setItem('user', JSON.stringify(user));
};

export const removeUserFromSessionStorage = (): GlobalState['user'] => {
  const user = getUserFromSessionStorage();
  if (!user) return user;

  sessionStorage.removeItem('user');
  return user;
};

export const getUserFromSessionStorage = (): GlobalState['user'] => {
  const result = sessionStorage.getItem('user');
  const user = result ? JSON.parse(result) : null;

  return user;
};

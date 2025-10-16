import { KnownError } from '@/app/store';
import { setUser } from '@/features/global/globalSlice';
import axios, { AxiosError } from 'axios';

import { removeUserFromSessionStorage } from './clientStorages';

const customFetch = axios.create({
  baseURL:
    import.meta.env.VITE_APP_API_BASE_URL + import.meta.env.VITE_APP_API_PREFIX,
  withCredentials: true,
});

export const checkForUnauthorizedResponse = (
  error: AxiosError<KnownError>,
  thunkAPI: any,
) => {
  if (error.response?.status === 401) {
    // message.error('해당 권한이 없습니다. 로그인 화면으로 이동합니다.');
    removeUserFromSessionStorage();
    thunkAPI.dispatch(setUser(null));

    return thunkAPI.rejectWithValue(
      '해당 권한이 없습니다. 로그인 화면으로 이동합니다.',
    );
  }

  return thunkAPI.rejectWithValue(error);
};

export default customFetch;

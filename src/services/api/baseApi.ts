import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_APP_API_BASE_URL + import.meta.env.VITE_APP_API_PREFIX,
  credentials: 'include',
});

export const queryTags = [
  'Dashboard',
  'Topology',
  'ConfigPerf',
  'Events',
  'RackLayout',
  'MapView',
  'Common',
  'TelephoneExchange',
  'Settings',
] as const;

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: queryTags,
  endpoints: () => ({}),
});

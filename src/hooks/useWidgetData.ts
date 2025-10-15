import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getWidgetData } from '@/features/dashboardPage/dashboardSlice';
import { LayoutItemWithId } from '@/features/dashboardPage/types';

// 위젯 데이터를 가져오는 Custom Hook
const useWidgetData = (data: LayoutItemWithId['data']) => {
  const dispatch = useAppDispatch();
  const { widgetData } = useAppSelector(store => store.dashboard);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getWidgetData(data));
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(
      fetchData,
      data.options.updateInterval * 1000,
    );

    return () => clearInterval(intervalId);
  }, [data, dispatch, setIsLoading]);

  return { isLoading, thisData: widgetData[data.id] };
};

export default useWidgetData;

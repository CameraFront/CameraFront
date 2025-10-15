import { useCallback, useState } from 'react';
import { App } from 'antd';
import { SortOption } from '@/types/api/common';
import { EventLv } from '@/types/enum';
import customFetch from '@/utils/axios';

interface Props {
  urlPath: string;
  filters?: {
    branchId?: number;
    eventTypes?: EventLv[];
    deviceType?: number;
    search?: string;
    sort?: SortOption;
  };
}

const useExcelDownload = (
  urlPath: Props['urlPath'],
  filters?: Props['filters'],
) => {
  const { message } = App.useApp();
  const [isExcelDownloading, setIsExcelDownloading] = useState(false);

  const handleExcelDownload = useCallback(async () => {
    setIsExcelDownloading(true);
    try {
      const { data } = await customFetch.post(
        urlPath,
        {
          ...(filters?.branchId && { managementCdTree: filters.branchId }),
          ...(filters?.eventTypes && { eventLv: filters.eventTypes.join(',') }),
          ...(filters?.deviceType && { deviceKind: filters.deviceType }),
          ...(filters?.search && { search: filters.search }),
          ...(filters?.sort && { sort: filters.sort }),
        },
        { responseType: 'blob' },
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'deviceList.xlsx');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
      link.parentNode?.removeChild(link);
    } catch (error) {
      message.error('다운로드 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsExcelDownloading(false);
    }
  }, [urlPath, filters, message]);

  return { handleExcelDownload, isExcelDownloading };
};

export default useExcelDownload;

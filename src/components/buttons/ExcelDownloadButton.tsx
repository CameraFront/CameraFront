import useExcelDownload from '@/hooks/useExcelDownload';
import { SortOption } from '@/types/api/common';
import { EventLv } from '@/types/enum';
import ExcelSymbol from '@/assets/icon__excel.svg?react';
import IconButton from './IconButton';

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

const ExcelDownloadButton = ({ urlPath, filters }: Props) => {
  const { handleExcelDownload, isExcelDownloading } = useExcelDownload(
    urlPath,
    filters,
  );

  return (
    <IconButton
      title="엑셀파일로 다운로드"
      type="default"
      onClick={handleExcelDownload}
      disabled={isExcelDownloading}
      loading={isExcelDownloading}
      icon={<ExcelSymbol />}
    />
  );
};

export default ExcelDownloadButton;

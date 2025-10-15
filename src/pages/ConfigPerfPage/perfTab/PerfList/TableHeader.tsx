import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { App, Input, Select } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import ExcelDownloadButton from '@/components/buttons/ExcelDownloadButton';
import SyncButton from '@/components/buttons/SyncButton';
import useExcelDownload from '@/hooks/useExcelDownload';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import { useLazyGetPerfDevicesByFilterQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';

const { Search } = Input;

const TableHeader = () => {
  const { message } = App.useApp();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search, deviceType, sort } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: resDeviceTypeList, isLoading: isDeviceTypeListLoading } =
    useGetDeviceTypeListQuery(true);
  const [
    getPerfDevicesByFilter,
    { isLoading: isPerfDevicesByFilterLoading, isError },
  ] = useLazyGetPerfDevicesByFilterQuery();
  const { handleExcelDownload, isExcelDownloading } = useExcelDownload(
    'device/exceldownloadDevicePerformance.do',
  );
  const [searchValue, setSearchValue] = useState(search);

  const onDeviceTypeChange = (value: number) => {
    setSearchParams(prev => {
      prev.set('deviceType', value.toString());
      return prev;
    });
  };

  const onSync = async () => {
    await getPerfDevicesByFilter({
      selectedBranch: parsedBranchId,
      deviceType,
      search,
      page,
      sort,
    });

    if (!isError) message.success('성공적으로 데이터를 갱신했습니다.');
  };

  return (
    <Wrapper>
      <div className="left-wrapper">
        <Search
          value={searchValue}
          style={{ width: '30rem', marginBottom: 8 }}
          placeholder="검색"
          className="search-bar"
          allowClear
          onChange={e => {
            setSearchValue(e.currentTarget.value);
          }}
          onSearch={value => {
            setSearchParams(prev => {
              prev.set('search', value);
              return prev;
            });
          }}
        />
        <Select<number>
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="장비 종류"
          style={{ width: '20rem', marginLeft: '8px' }}
          options={
            resDeviceTypeList?.map(item => ({
              label: item.deviceKindNm,
              value: item.deviceKind,
            })) || []
          }
          onChange={onDeviceTypeChange}
        />
      </div>
      <div className="right-wrapper">
        <SyncButton
          isLoading={isPerfDevicesByFilterLoading}
          disabled={isPerfDevicesByFilterLoading}
          onClick={onSync}
        />
        <ExcelDownloadButton urlPath="device/exceldownloadDevicePerformance.do" />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 0.5rem 0 1.2rem 0;

  .left-wrapper {
    .search-bar {
      .ant-input-affix-wrapper {
        background-color: ${themeGet('colors.bgDescriptionsContent')};
      }
      .ant-input-group-addon button {
        background-color: ${themeGet('colors.bgDescriptionsLabel')};
      }
    }

    .ant-select-selector {
      background: ${themeGet('colors.bgDescriptionsContent')};
    }
  }

  .right-wrapper {
    display: flex;
    gap: ${themeGet('spacing.s2')};
    .ant-btn {
      background: ${themeGet('colors.bgDescriptionsContent')};
    }
  }
`;

export default TableHeader;

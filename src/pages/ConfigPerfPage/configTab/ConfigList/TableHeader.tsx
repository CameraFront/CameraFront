import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Select } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import IconButton from '@/components/buttons/IconButton';
import useExcelDownload from '@/hooks/useExcelDownload';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import ExcelSymbol from '@/assets/icon__excel.svg?react';

const { Search } = Input;

const TableHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search, deviceType } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: resDeviceTypeList, isLoading: isDeviceTypeListLoading } =
    useGetDeviceTypeListQuery();
  const { handleExcelDownload, isExcelDownloading } = useExcelDownload(
    'device/exceldownloadDevice.do',
  );
  const [searchValue, setSearchValue] = useState(search);

  const onDeviceTypeChange = (value: number) => {
    setSearchParams(prev => {
      prev.set('deviceType', value.toString());
      return prev;
    });
  };

  const onDeviceTypeClear = () => {
    setSearchParams(prev => {
      prev.delete('deviceType');
      return prev;
    });
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
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="종류"
          style={{ width: '20rem', marginLeft: '8px' }}
          options={
            resDeviceTypeList?.map(item => ({
              label: item.deviceKindNm,
              value: item.deviceKind,
            })) || []
          }
          onChange={onDeviceTypeChange}
          onClear={onDeviceTypeClear}
        />
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="접속 상태"
          style={{ width: '20rem', marginLeft: '8px' }}
          options={
            resDeviceTypeList?.map(item => ({
              label: item.deviceKindNm,
              value: item.deviceKind,
            })) || []
          }
          onChange={onDeviceTypeChange}
          onClear={onDeviceTypeClear}
        />
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="화각 상태"
          style={{ width: '20rem', marginLeft: '8px' }}
          options={
            resDeviceTypeList?.map(item => ({
              label: item.deviceKindNm,
              value: item.deviceKind,
            })) || []
          }
          onChange={onDeviceTypeChange}
          onClear={onDeviceTypeClear}
        />
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="알람 레벨"
          style={{ width: '20rem', marginLeft: '8px' }}
          options={
            resDeviceTypeList?.map(item => ({
              label: item.deviceKindNm,
              value: item.deviceKind,
            })) || []
          }
          onChange={onDeviceTypeChange}
          onClear={onDeviceTypeClear}
        />
      </div>
      <div className="right-wrapper">
        <IconButton
          title="엑셀파일로 저장하기"
          type="default"
          onClick={handleExcelDownload}
          disabled={isExcelDownloading}
          loading={isExcelDownloading}
          icon={<ExcelSymbol />}
        />
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
      .ant-input-affix-wrapper{
        background-color: ${themeGet('colors.bgDescriptionsContent')};
      }
      .ant-input-group-addon button{
        background-color: ${themeGet('colors.bgDescriptionsLabel')};
      }
    }
    
    .ant-select-selector {
      background: ${themeGet('colors.bgDescriptionsContent')};
    }
  }

  .right-wrapper {
    .ant-btn {
      background: ${themeGet('colors.bgDescriptionsContent')};
    }
  }
`;

export default TableHeader;

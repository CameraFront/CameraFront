import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Select, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { FileTextOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { SETTINGS_PATH } from '@/services/api/apiPaths';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import {
  useDeleteDeviceManualMutation,
  useGetDeviceManualListQuery,
} from '@/services/api/settings/deviceManuals';
import {
  DeviceManualListFilters,
  OpenedModalType,
  ResDeviceManualList,
} from '@/types/api/settings';
import customFetch from '@/utils/axios';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import { YEAR_DATE_FORMAT } from '@/config';
import FormModal from './FormModal';

const { Search } = Input;

const DeviceManualsTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const { data: deviceTypes } = useGetDeviceTypeListQuery(true);
  const [filter, setFilter] = useState<DeviceManualListFilters>({
    deviceType: undefined,
    search: undefined,
    page: 1,
  });
  const { data: manualList, isLoading } = useGetDeviceManualListQuery(filter);
  const [deleteDeviceManual, { isLoading: isDeleting }] =
    useDeleteDeviceManualMutation();

  const onDownloadManual = useCallback(
    async (seqNum: number) => {
      try {
        const { data } = await customFetch.post(
          `${SETTINGS_PATH}/downloadDeviceManual.do`,
          {
            seqNum,
          },
          { responseType: 'blob' },
        );

        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'manual.pdf');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(downloadUrl);
        link.parentNode?.removeChild(link);
      } catch (error) {
        message.error('다운로드 중 오류가 발생했습니다.');
        console.error(error);
      }
    },
    [message],
  );

  const columns = useMemo<
    TableColumnsType<ResDeviceManualList['listManual'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '등록일',
        dataIndex: 'regDt',
        key: 'regDt',
        render: (value: string) => dayjs(value).format(YEAR_DATE_FORMAT),
      },
      {
        title: '대분류',
        dataIndex: 'depth1Nm',
        key: 'depth1Nm',
      },
      {
        title: '매뉴얼명',
        dataIndex: 'manualNm',
        key: 'manualNm',
      },
      {
        title: '버전',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '모델명',
        dataIndex: 'modelNm',
        key: 'modelNm',
      },
      {
        title: '파일명',
        dataIndex: 'fileNm',
        key: 'fileNm',
      },
      {
        title: '매뉴얼보기',
        render: (_, record) => (
          <Button
            type="text"
            onClick={() => {
              onDownloadManual(record.seqNum);
            }}
          >
            <FileTextOutlined
              style={{
                fontSize: 16,
              }}
            />
          </Button>
        ),
      },
    ],
    [onDownloadManual],
  );

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteDeviceManual(selectedRowId);
    message.success(getSuccessMessage('delete', '매뉴얼이'));
  };

  const onSearch = (value: string) => {
    setFilter(prev => ({ ...prev, page: 1, search: value }));
  };

  const onPageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
  };

  const onDeviceTypeChange = (value: number) => {
    setFilter(prev => ({
      ...prev,
      page: 1,
      deviceType: value,
    }));
    setSelectedRowId(null);
  };

  const onModalOpen = (type: OpenedModalType) => {
    setOpenedModalType(type);
  };

  const onModalClose = () => {
    setOpenedModalType(null);
    setSelectedRowId(null);
  };

  const deviceTypeOptions = useMemo(
    () =>
      deviceTypes?.map(item => ({
        label: item.deviceKindNm,
        value: item.deviceKind,
      })) || [],
    [deviceTypes],
  );

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search
            className="search-phone"
            placeholder="매뉴얼 검색"
            allowClear
            onSearch={onSearch}
          />
          <Select
            className="select-type"
            allowClear
            placeholder="장비종류"
            value={filter.deviceType}
            options={deviceTypeOptions}
            onChange={onDeviceTypeChange}
          />
        </div>
        <div className="right-wrapper">
          <DangerConfirmButton
            title="정말 선택된 매뉴얼을 삭제하시겠습니까?"
            description="삭제된 매뉴얼은 복구할 수 없습니다."
            onConfirm={onDelete}
            loading={isDeleting}
            disabled={!selectedRowId}
          >
            삭제
          </DangerConfirmButton>
          <Button
            disabled={!selectedRowId}
            onClick={() => onModalOpen('update')}
          >
            수정
          </Button>
          <Button type="primary" onClick={() => onModalOpen('create')}>
            추가
          </Button>
        </div>
      </div>
      <div className="content">
        <Table
          bordered
          loading={{
            spinning: isLoading,
            indicator: <RegularLoadingSpinner />,
          }}
          size="small"
          rowKey={row => row.seqNum}
          columns={columns}
          dataSource={manualList?.listManual}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: manualList?.page.page || 1,
            pageSize: manualList?.page.rows || 10,
            total: manualList?.page.records || 0,
            showTotal: total => `총 ${formatNumber(total)}개`,
            onChange: onPageChange,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRowId ? [selectedRowId] : [],
            onChange: selectedRowKeys => {
              setSelectedRowId(selectedRowKeys[0] as number);
            },
          }}
        />
      </div>
      {openedModalType && (
        <FormModal
          openedModalType={openedModalType}
          id={selectedRowId}
          onCloseModal={onModalClose}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .left-wrapper {
      display: flex;
      gap: 0.8rem;

      .search-phone {
        width: auto;
      }

      .select-type {
        width: 16rem;
      }
    }

    .right-wrapper {
      display: flex;
      gap: 0.8rem;
    }

    .btn-delete {
      &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
        color: ${themeGet('colors.textDanger')};
        border-color: ${themeGet('colors.textDanger')};
      }
    }
  }

  .content {
    .ant-table-wrapper .ant-table-selection-col {
      width: 4.8rem;
    }
  }
`;

export default DeviceManualsTab;

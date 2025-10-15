import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Select, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { DEVICE_PATH } from '@/services/api/apiPaths';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import {
  useDeleteDeviceInspectionMutation,
  useGetDeviceInspectionListQuery,
} from '@/services/api/settings/deviceInspections';
import {
  DeviceInspectionListFilters,
  OpenedModalType,
  ResDeviceInspectionList,
} from '@/types/api/settings';
import customFetch from '@/utils/axios';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import { YEAR_DATE_FORMAT } from '@/config';
import FormModal from './FormModal';

const { Search } = Input;

const DeviceInspectionsTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const { data: deviceTypes } = useGetDeviceTypeListQuery(true);
  const [filter, setFilter] = useState<DeviceInspectionListFilters>({
    deviceType: undefined,
    search: undefined,
    page: 1,
  });
  const { data: inspectionList, isLoading } =
    useGetDeviceInspectionListQuery(filter);
  const [deleteDeviceInspection, { isLoading: isDeleting }] =
    useDeleteDeviceInspectionMutation();

  const onDownloadPhoto = useCallback(
    async (seqNum: number) => {
      try {
        const response = await customFetch.post(
          `${DEVICE_PATH}/downloadDeviceCheckUp.do`,
          {
            seqNum,
            reqOption: 2,
          },
          { responseType: 'blob' },
        );

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'device-check-up-photo.jpg';

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
            filename = decodeURIComponent(filename);
          }
        }

        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data]),
        );
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
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

  const onDownloadReport = useCallback(
    async (seqNum: number) => {
      try {
        const { data } = await customFetch.post(
          `${DEVICE_PATH}/downloadDeviceCheckUp.do`,
          {
            seqNum,
            reqOption: 1,
          },
          { responseType: 'blob' },
        );

        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `device-check-up-report.pdf`);
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
    TableColumnsType<ResDeviceInspectionList['listDeviceCheckUp'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'No',
        key: 'no',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
      },
      {
        title: '장비종류',
        dataIndex: 'deviceKindNm',
        key: 'deviceKindNm',
      },
      {
        title: '장비명',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
      },

      {
        title: '점검일자',
        dataIndex: 'checkDt',
        key: 'checkDt',
        render: (value: string) => dayjs(value).format(YEAR_DATE_FORMAT),
      },
      {
        title: '담당업체',
        dataIndex: 'companyNm',
        key: 'companyNm',
      },
      {
        title: '담당자',
        dataIndex: 'managerNm',
        key: 'managerNm',
      },
      {
        title: '점검사진',
        dataIndex: 'photoFileNm',
        render: (value: string, record) =>
          value && (
            <Button
              type="text"
              onClick={() => {
                onDownloadPhoto(record.seqNum);
              }}
            >
              <PictureOutlined
                style={{
                  fontSize: 16,
                }}
              />
            </Button>
          ),
      },
      {
        title: '보고서',
        dataIndex: 'reportFileNm',
        render: (value, record) =>
          value && (
            <Button
              type="text"
              onClick={() => {
                onDownloadReport(record.seqNum);
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
    [onDownloadReport, onDownloadPhoto],
  );

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteDeviceInspection(selectedRowId);
    message.success(getSuccessMessage('delete', '점검이'));
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
            placeholder="장비 검색"
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
            title="정말 선택된 점검을 삭제하시겠습니까?"
            description="삭제된 점검은 복구할 수 없습니다."
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
          dataSource={inspectionList?.listDeviceCheckUp}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: inspectionList?.page.page || 1,
            pageSize: inspectionList?.page.rows || 10,
            total: inspectionList?.page.records || 0,
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

export default DeviceInspectionsTab;

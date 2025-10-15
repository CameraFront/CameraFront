import { useMemo, useState } from 'react';
import {
  App,
  Button,
  Input,
  MenuProps,
  Select,
  Table,
  TableColumnsType,
} from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import ImportExportGroup from '@/components/ImportExportGroup';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import UploadModal from '@/components/UploadModal';
import { SETTINGS_PATH } from '@/services/api/apiPaths';
import { useDownloadExcelMutation } from '@/services/api/common';
import {
  useDeletePhoneMutation,
  useGetPhoneListQuery,
  useGetPhoneListScanQuery,
  useGetPhoneTypeListQuery,
} from '@/services/api/settings/phones';
import {
  OpenedModalType,
  PhoneListFilters,
  ResPhoneList,
  ResPhoneListScan,
} from '@/types/api/settings';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import FormModal from './FormModal';

const { Search } = Input;

const PhonesTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filter, setFilter] = useState<PhoneListFilters>({
    managementCd: undefined,
    phoneType: undefined,
    search: undefined,
    page: 1,
  });
  const { data: phoneTypeList } = useGetPhoneTypeListQuery({
    hasPagination: false,
  });
  // const {
  //   data: phoneList,
  //   isLoading,
  //   refetch: refetchPhoneList,
  // } = useGetPhoneListQuery(filter);
  const {
    data: phoneList,
    isLoading,
    refetch: refetchPhoneList,
  } = useGetPhoneListScanQuery(filter);
  const [deletePhone, { isLoading: isDeleting }] = useDeletePhoneMutation();
  const [downloadExcel, { isLoading: isDownloading }] =
    useDownloadExcelMutation();

  const columns = useMemo<TableColumnsType<ResPhoneListScan['listPhone'][number]>>(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '소속1',
        dataIndex: 'phoneDepth1',
        key: 'phoneDepth1',
        ellipsis: true,
      },
      
      {
        title: '소속2',
        dataIndex: 'phoneDepth2',
        key: 'phoneDepth2',
        ellipsis: true,
      },
      {
        title: '내선번호',
        dataIndex: 'internalNum',
        key: 'internalNum',
      },
      {
        title: '아이피',
        dataIndex: 'ipAddr',
        key: 'ipAddr',
      },
      {
        title: '전화종류',
        dataIndex: 'phoneType',
        key: 'phoneType',
      },
    ],
    [],
  );
  const onDelete = () => {
    if (!selectedRowId) return;
    deletePhone(selectedRowId);
    message.success(getSuccessMessage('delete', '전화기가'));
  };

  const onSearch = (value: string) => {
    setFilter(prev => ({ ...prev, page: 1, search: value }));
  };

  const onPageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
  };

  const onPhoneTypeChange = (value: number) => {
    setFilter(prev => ({ ...prev, phoneType: value }));
  };

  const onModalOpen = (type: OpenedModalType) => {
    setOpenedModalType(type);
  };

  const onModalClose = () => {
    setOpenedModalType(null);
    setSelectedRowId(null);
  };

  const onUploadModalClose = () => {
    setIsUploadModalOpen(false);
  };

  const onUploadSuccess = () => {
    refetchPhoneList();
  };

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'export',
        label: '다운로드',
        onClick: async () => {
          await downloadExcel({
            urlPath: `${SETTINGS_PATH}/exceldownloadPhoneScan.do`,
            filename: 'phoneList.xlsx',
          });
        },
      },
      // {
      //   key: 'import',
      //   label: '업로드',
      //   onClick: () => setIsUploadModalOpen(true),
      // },
    ],
    [downloadExcel],
  );

  const phoneTypeOptions = useMemo(
    () =>
      phoneTypeList?.listPhoneType.map(phoneType => ({
        label: phoneType.phoneTypeNm,
        value: phoneType.phoneType,
      })) || [],
    [phoneTypeList],
  );

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search
            className="search-phone"
            placeholder="소속/전화기명 검색"
            allowClear
            onSearch={onSearch}
          />
          <Select
            className="select-phone-type"
            allowClear
            placeholder="전화기 종류"
            options={phoneTypeOptions}
            onChange={onPhoneTypeChange}
          />
        </div>
        <div className="right-wrapper">
          <DangerConfirmButton
            title="정말 선택된 전화기를 삭제하시겠습니까?"
            description="삭제된 전화기는 복구할 수 없습니다."
            onConfirm={onDelete}
            loading={isDeleting}
            disabled={!selectedRowId}
          >
            삭제
          </DangerConfirmButton>
          {/* <Button
            disabled={!selectedRowId}
            onClick={() => onModalOpen('update')}
          >
            수정
          </Button>
          <Button type="primary" onClick={() => onModalOpen('create')}>
            추가
          </Button> */}
          <ImportExportGroup items={items} />
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
          rowKey={row => row.phoneKey}
          columns={columns}
          dataSource={phoneList?.listPhone}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: phoneList?.page.page || 1,
            pageSize: phoneList?.page.rows || 10,
            total: phoneList?.page.records || 0,
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
      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={onUploadModalClose}
          urlPath={`${SETTINGS_PATH}/exceluploadPhone.do`}
          title="전화기목록 업로드"
          onSuccess={onUploadSuccess}
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

      .select-phone-type {
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

export default PhonesTab;

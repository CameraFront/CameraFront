import { useEffect, useMemo, useState } from 'react';
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
import {
  useDownloadExcelMutation,
  useLazyGetParentBranchListQuery,
} from '@/services/api/common';
import {
  useDeleteTerminalMutation,
  useGetTerminalListQuery,
} from '@/services/api/settings/terminals';
import { OptionType } from '@/types/api/common';
import {
  OpenedModalType,
  ResTerminalList,
  TerminalListFilters,
} from '@/types/api/settings';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import FormModal from './FormModal';

const { Search } = Input;

const TerminalsTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filter, setFilter] = useState<TerminalListFilters>({
    managementCd1: undefined,
    managementCd2: undefined,
    managementCd3: undefined,
    search: undefined,
    page: 1,
  });
  const [managementCd1Options, setManagementCd1Options] = useState<
    OptionType[]
  >([]);
  const [managementCd2Options, setManagementCd2Options] = useState<
    OptionType[]
  >([]);
  const [managementCd3Options, setManagementCd3Options] = useState<
    OptionType[]
  >([]);
  const {
    data: terminalList,
    isLoading,
    refetch: refetchTerminalList,
  } = useGetTerminalListQuery(filter);
  const [getManagementList] = useLazyGetParentBranchListQuery();
  const [deleteTerminal, { isLoading: isDeleting }] =
    useDeleteTerminalMutation();
  const [downloadExcel, { isLoading: isDownloading }] =
    useDownloadExcelMutation();

  const columns = useMemo<
    TableColumnsType<ResTerminalList['cameraList'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
      },
      {
        title: '종류',
        dataIndex: 'cameraTypeNm',
        key: 'cameraTypeNm',
      },
      {
        title: '단말기명',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
      },
      {
        title: 'IP주소',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
      },
      {
        title: '위치',
        dataIndex: 'pstnNm',
        key: 'pstnNm',
      },
      {
        title: '관리여부',
        dataIndex: 'manageYnNm',
        key: 'manageYnNm',
      },
    ],
    [],
  );

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'export',
        label: '다운로드',
        onClick: async () => {
          await downloadExcel({
            urlPath: `${SETTINGS_PATH}/exceldownloadCamera.do`,
            filename: 'terminalList.xlsx',
          });
        },
      },
      {
        key: 'import',
        label: '업로드',
        onClick: () => setIsUploadModalOpen(true),
      },
    ],
    [downloadExcel],
  );

  const onManagementCd1Change = (value: number) => {
    setFilter(prev => ({
      ...prev,
      page: 1,
      managementCd1: value,
      managementCd2: undefined,
      managementCd3: undefined,
    }));
    setManagementCd2Options([]);
    setManagementCd3Options([]);
    setSelectedRowId(null);

    getManagementList({
      depth: 2,
      managementCdTree: value,
    })
      .unwrap()
      .then(res => {
        setManagementCd2Options(
          res.map(item => ({
            label: item.managementNm,
            value: item.managementCd,
          })),
        );
      });
  };

  const onManagementCd2Change = (value: number) => {
    setFilter(prev => ({
      ...prev,
      page: 1,
      managementCd2: value,
      managementCd3: undefined,
    }));
    setManagementCd3Options([]);
    setSelectedRowId(null);

    getManagementList({
      depth: 3,
      managementCdTree: value,
    })
      .unwrap()
      .then(res => {
        setManagementCd3Options(
          res.map(item => ({
            label: item.managementNm,
            value: item.managementCd,
          })),
        );
      });
  };

  const onManagementCd3Change = (value: number) => {
    setFilter(prev => ({
      ...prev,
      page: 1,
      managementCd3: value,
    }));
    setSelectedRowId(null);
  };

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteTerminal(selectedRowId);
    message.success(getSuccessMessage('delete', '단말기가'));
  };

  const onSearch = (value: string) => {
    setFilter(prev => ({ ...prev, page: 1, search: value }));
  };

  const onPageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
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
    refetchTerminalList();
  };

  useEffect(() => {
    getManagementList({ depth: 1 })
      .unwrap()
      .then(res => {
        setManagementCd1Options(
          res.map(item => ({
            label: item.managementNm,
            value: item.managementCd,
          })),
        );
      });
  }, [getManagementList]);

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search
            className="search-box"
            placeholder="단말기 검색"
            allowClear
            onSearch={onSearch}
          />
          <Select
            className="select-box small"
            allowClear
            placeholder="소속1"
            value={filter.managementCd1}
            options={managementCd1Options}
            onChange={onManagementCd1Change}
          />
          <Select
            className="select-box small"
            allowClear
            placeholder="소속2"
            value={filter.managementCd2}
            options={managementCd2Options}
            onChange={onManagementCd2Change}
          />
          <Select
            className="select-box small"
            allowClear
            placeholder="소속3"
            value={filter.managementCd3}
            options={managementCd3Options}
            onChange={onManagementCd3Change}
          />
        </div>
        <div className="right-wrapper">
          <Button
            disabled={!selectedRowId}
            onClick={() => onModalOpen('clone')}
          >
            복제
          </Button>
          <DangerConfirmButton
            title="정말 선택된 단말기를 삭제하시겠습니까?"
            description="삭제된 단말기는 복구할 수 없습니다."
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
          rowKey={row => row.deviceKey}
          columns={columns}
          dataSource={terminalList?.cameraList}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: terminalList?.page.page || 1,
            pageSize: terminalList?.page.rows || 10,
            total: terminalList?.page.records || 0,
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
          urlPath={`${SETTINGS_PATH}/exceluploadCamera.do`}
          title="단말기목록 업로드"
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

      .search-box {
        width: auto;
      }

      .select-box {
        width: 16rem;

        &.small {
          width: 12rem;
        }
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

export default TerminalsTab;

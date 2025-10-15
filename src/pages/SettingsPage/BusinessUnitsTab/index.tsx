import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import {
  useDeleteManagementMutation,
  useGetManagementListQuery,
} from '@/services/api/settings/managements';
import { ResManagementList } from '@/types/api/settings';
import { isQueryResponseError } from '@/types/common';
import { formatNumber } from '@/utils/formatters';
import { ERROR_MESSAGES, getSuccessMessage } from '@/config/messages';
import EditFormModal from './EditFormModal';
import NewFormModal from './NewFormModal';

const { Search } = Input;

// 상위 소속으로 두고 싶은 소속을 선택 후 추가 버튼 클릭 시 모달 오픈
// 수정하고 싶은 소속을 선택 후 수정 버튼 클릭 시 모달 오픈
const BusinessUnitsTab = () => {
  const { message, modal } = App.useApp();
  const [selectedRow, setSelectedRow] = useState<
    ResManagementList['listManagement'][number] | null
  >(null);
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState<boolean>(false);
  const [isEditFormModalOpen, setIsEditFormModalOpen] =
    useState<boolean>(false);
  const [deleteManagement, { isLoading: isDeleting }] =
    useDeleteManagementMutation();
  const [page, setPage] = useState(1);
  const [depth, setDepth] = useState(1);
  const [managementCdTree, setManagementCdTree] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const { data: businessUnits, isLoading } = useGetManagementListQuery({
    depth,
    managementCdTree,
    page,
    search,
  });

  const columns = useMemo<
    TableColumnsType<ResManagementList['listManagement'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        width: '10%',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
        width: '30%',
      },
      {
        title: '상위소속',
        render: (_, record) =>
          record.parentNode ? (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedRow(null);
                setPage(1);
                setDepth(record.depth - 1);
                const parentNodes = [
                  null,
                  ...record.path.split('/').slice(1).map(Number),
                ];
                setManagementCdTree(parentNodes[record.depth - 2]);
              }}
            >
              보기
            </Button>
          ) : null,
      },
      {
        title: '하위소속',
        render: (_, record) =>
          record.endNode === 'N' ? (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedRow(null);
                setDepth(record.depth + 1);
                setManagementCdTree(record.managementCd);
                setPage(1);
              }}
            >
              보기
            </Button>
          ) : null,
      },
    ],
    [],
  );

  const onCloseModal = useCallback(() => {
    setIsNewFormModalOpen(false);
    setIsEditFormModalOpen(false);
    setSelectedRow(null);
  }, []);

  const onSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const onDelete = useCallback(async () => {
    if (!selectedRow) return;

    try {
      await deleteManagement(selectedRow.managementCd).unwrap();
      message.success(getSuccessMessage('delete', '소속이'));
    } catch (error) {
      if (isQueryResponseError(error)) {
        if (error.data.status === '7013') {
          modal.error({
            title: '소속된 장비가 있어서 삭제할 수 없습니다.',
            content: '소속 된 모든 장비들을 삭제한 후 다시 진행하세요.',
          });
          return;
        }

        if (error.data.status === '7014') {
          modal.error({
            title: '하위 소속이 남아있어 삭제할 수 없습니다.',
            content: '하위 소속을 모두 삭제한 후 다시 진행하세요.',
          });
          return;
        }

        message.error(ERROR_MESSAGES[500]);
      }
    }
  }, [selectedRow, deleteManagement, message, modal]);

  const onAdd = useCallback(() => {
    if (selectedRow?.depth && selectedRow.depth >= 3) {
      message.error('3단계 이상 소속을 추가할 수 없습니다.');
      return;
    }

    setIsNewFormModalOpen(true);
  }, [selectedRow, message]);

  const onEdit = useCallback(() => {
    if (!selectedRow) return;

    setIsEditFormModalOpen(true);
  }, [selectedRow]);

  const onPageChange = useCallback((page: number) => {
    setPage(page);
    setSelectedRow(null);
  }, []);

  if (!businessUnits) return null;
  const isSelected = !!selectedRow;
  const isDeletable = selectedRow?.endNode === 'Y';

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search placeholder="소속명 검색" allowClear onSearch={onSearch} />
        </div>
        <div className="right-wrapper">
          <DangerConfirmButton
            title="정말 선택된 소속을 삭제하시겠습니까?"
            description="삭제된 소속은 복구할 수 없습니다."
            onConfirm={onDelete}
            loading={isDeleting}
            disabled={!isSelected || !isDeletable}
          >
            삭제
          </DangerConfirmButton>
          <Button disabled={!isSelected} onClick={onEdit}>
            수정
          </Button>
          <Button onClick={onAdd} type="primary">
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
          rowKey={row => row.managementCd}
          columns={columns}
          dataSource={businessUnits.listManagement}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: businessUnits.page.page,
            pageSize: businessUnits.page.rows,
            total: businessUnits.page.records,
            showTotal: total => `총 ${formatNumber(total)}개`,
            onChange: onPageChange,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRow ? [selectedRow.managementCd] : [],
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows[0]);
            },
          }}
        />
      </div>
      {isNewFormModalOpen && (
        <NewFormModal isOpen={isNewFormModalOpen} onCloseModal={onCloseModal} />
      )}
      {isEditFormModalOpen && selectedRow && (
        <EditFormModal
          isOpen={isEditFormModalOpen}
          selectedRow={selectedRow}
          onCloseModal={onCloseModal}
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

export default BusinessUnitsTab;

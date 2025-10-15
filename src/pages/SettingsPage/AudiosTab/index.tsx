import { useMemo, useState } from 'react';
import { App, Button, Input, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import AudioPlayButton from '@/components/AudioPlayButton';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import {
  useDeleteAudioMutation,
  useGetAudioListQuery,
} from '@/services/api/settings/audios';
import { OpenedModalType, ResAudioList } from '@/types/api/settings';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import FormModal from './FormModal';

const { Search } = Input;

const AudiosTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [deleteAudio, { isLoading: isDeleting }] = useDeleteAudioMutation();
  const [filter, setFilter] = useState<{
    search: string | undefined;
    page: number;
  }>({
    search: undefined,
    page: 1,
  });

  const { data: audioList, isLoading } = useGetAudioListQuery(filter);

  const columns = useMemo<TableColumnsType<ResAudioList['listAudio'][number]>>(
    () => [
      {
        title: 'No.',
        dataIndex: 'seqNum',
        key: 'seqNum',
      },
      {
        title: '사운드명',
        dataIndex: 'soundNm',
        key: 'soundNm',
      },
      {
        title: '사운드 파일명',
        dataIndex: 'fileNm',
        key: 'fileNm',
      },
      {
        title: '사운드 듣기',
        dataIndex: 'seqNum',
        key: 'seqNum',
        render: value => <AudioPlayButton stopPropagation audioKey={value} />,
      },
    ],
    [],
  );

  const onSearch = (value: string) => {
    setFilter(prev => ({ ...prev, page: 1, search: value }));
  };

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteAudio(selectedRowId);
    message.success(getSuccessMessage('delete', '오디오가'));
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

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search placeholder="이름 검색" allowClear onSearch={onSearch} />
        </div>
        <div className="right-wrapper">
          <DangerConfirmButton
            title="정말 선택된 오디오를 삭제하시겠습니까?"
            description="삭제된 오디오는 복구할 수 없습니다."
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
          <Button onClick={() => onModalOpen('create')} type="primary">
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
          dataSource={audioList?.listAudio}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: audioList?.page.page || 1,
            pageSize: audioList?.page.rows || 10,
            total: audioList?.page.records || 0,
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
    }

    .right-wrapper {
      display: flex;
      gap: 0.8rem;
    }
  }

  .content {
    .ant-table-wrapper .ant-table-selection-col {
      width: 4.8rem;
    }
  }
`;

export default AudiosTab;

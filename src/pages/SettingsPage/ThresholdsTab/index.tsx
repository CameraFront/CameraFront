import { useMemo, useState } from 'react';
import { App, Button, Input, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetThresholdListQuery } from '@/services/api/settings/thresholds';
import { OpenedModalType, ResThresholdList } from '@/types/api/settings';
import { formatNumber } from '@/utils/formatters';
import FormModal from './FormModal';

const { Search } = Input;

const ThresholdsTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [filter, setFilter] = useState<{
    search: string | undefined;
    page: number;
  }>({
    search: undefined,
    page: 1,
  });
  const { data: thresholdList, isLoading } = useGetThresholdListQuery(filter);

  const columns = useMemo<
    TableColumnsType<ResThresholdList['listDeviceThr'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        width: '4%',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '장비종류',
        dataIndex: 'deviceKindNm',
        key: 'deviceKindNm',
        width: '10%',
        ellipsis: true,
      },
      {
        title: '장비명',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
      },
      {
        title: 'CPU(%)',
        dataIndex: 'cpuThr',
        key: 'cpuThr',
        width: '14%',
        ellipsis: true,
      },
      {
        title: '메모리(%)',
        dataIndex: 'memThr',
        key: 'memThr',
        width: '14%',
        ellipsis: true,
      },
      {
        title: '디스크(%)',
        dataIndex: 'fsThr',
        key: 'fsThr',
        width: '14%',
        ellipsis: true,
      },
      // {
      //   title: 'GPU1(%)',
      //   dataIndex: 'gpu1Thr',
      //   key: 'gpu1Thr',
      //   width: '7%',
      //   ellipsis: true,
      // },
      // {
      //   title: 'GPU2(%)',
      //   dataIndex: 'gpu2Thr',
      //   key: 'gpu2Thr',
      //   width: '7%',
      //   ellipsis: true,
      // },
      // {
      //   title: 'GPU3(%)',
      //   dataIndex: 'gpu3Thr',
      //   key: 'gpu3Thr',
      //   width: '7%',
      //   ellipsis: true,
      // },
      // {
      //   title: 'GPU4(%)',
      //   dataIndex: 'gpu4Thr',
      //   key: 'gpu4Thr',
      //   width: '7%',
      //   ellipsis: true,
      // },
    ],
    [],
  );

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

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search placeholder="소속/장비 검색" allowClear onSearch={onSearch} />
        </div>
        <div className="right-wrapper">
          <Button
            disabled={!selectedRowId}
            onClick={() => onModalOpen('update')}
          >
            수정
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
          // FIXME: 리스트에 중복되는 deviceKey가 있어서 오류가 발생함.
          rowKey={row => row.deviceKey}
          columns={columns}
          dataSource={thresholdList?.listDeviceThr}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: thresholdList?.page.page || 1,
            pageSize: thresholdList?.page.rows || 10,
            total: thresholdList?.page.records || 0,
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

export default ThresholdsTab;

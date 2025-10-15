import { useCallback, useEffect, useMemo } from 'react';
import { App, Switch, Table, TableColumnsType, Tag, Typography } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import {
  useLazyGetPortListQuery,
  useUpdatePortManagedStatusMutation,
} from '@/services/api/configPerf';
import { ResPortList } from '@/types/api/configPerf';
import { ResManageYn } from '@/types/enum';
import { formatNumber } from '@/utils/formatters';

const DEFAULT_PAGE_SIZE = 5;

const NetworkTypeSection = ({ deviceId }: { deviceId: number | undefined }) => {
  const { modal } = App.useApp();
  const [
    getPortList,
    {
      data: resPortList,
      isLoading: isLoadingPortList,
      isError: isErrorPortList,
    },
  ] = useLazyGetPortListQuery();
  const [
    updatePortManagedStatus,
    {
      isLoading: isLoadingUpdatePortManagedStatus,
      isError: isErrorUpdatePortManagedStatus,
    },
  ] = useUpdatePortManagedStatusMutation();

  const onSwitchChange = useCallback(
    (checked: boolean, portId: number, deviceId: number) => {
      modal.confirm({
        centered: true,
        title: '포트 관리 상태 변경',
        content: checked ? (
          <div>
            <strong>관리</strong> 상태로 변경하시겠습니까?
            <br />
            변경 시 장애관리 대상이 됩니다.
          </div>
        ) : (
          <div>
            <strong>비관리</strong> 상태로 변경하시겠습니까?
            <br />
            변경 시 장애관리에서 제외됩니다.
          </div>
        ),
        onOk: () => {
          updatePortManagedStatus({
            deviceId,
            portId,
            isManaged: checked ? ResManageYn.관리 : ResManageYn.비관리,
          });
        },
        okButtonProps: {
          loading: isLoadingUpdatePortManagedStatus,
        },
      });
    },
    [modal, updatePortManagedStatus, isLoadingUpdatePortManagedStatus],
  );

  const columns = useMemo<TableColumnsType<ResPortList['portList'][number]>>(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        ellipsis: true,
        width: '10%',
        align: 'center',
      },
      {
        title: '포트번호',
        dataIndex: 'portKey',
        key: 'portKey',
        align: 'center',
      },
      {
        title: '연결 장비',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
        // width: '12%',
        align: 'center',
      },
      {
        title: '연결 장비 IP 주소',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'fault',
        key: 'fault',
        render: (_, record) => (
          <Tag color={record.fault === '장애' ? 'red' : 'default'}>
            {record.fault}
          </Tag>
        ),
        align: 'center',
      },
      {
        title: '관리여부',
        dataIndex: 'manageYn',
        key: 'manageYn',
        render: (_, record) => (
          <Switch
            checked={record.manageYn === ResManageYn.관리}
            onChange={checked =>
              onSwitchChange(checked, record.portKey, deviceId ?? 0)
            }
          />
        ),
        align: 'center',
      },
    ],
    [deviceId, onSwitchChange],
  );

  useEffect(() => {
    if (!deviceId) return;
    getPortList({ deviceId, page: 1 });
  }, [deviceId, getPortList]);

  const tableTitle = useCallback(
    () => (
      <Typography.Title level={5} style={{ marginBottom: 0 }}>
        포트별 단말 목록
      </Typography.Title>
    ),
    [],
  );

  if (!deviceId)
    return (
      <ErrorMessage>
        데이터를 불러올 수 없습니다.
        <br />
        장비 아이디를 확인하세요.
      </ErrorMessage>
    );

  return (
    <Wrapper>
      <Table<ResPortList['portList'][number]>
        loading={{
          spinning: isLoadingPortList,
          indicator: <RegularLoadingSpinner />,
        }}
        title={tableTitle}
        size="small"
        rowKey={record => record.portKey}
        columns={columns}
        dataSource={resPortList?.portList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: resPortList?.page.page,
          pageSize: resPortList?.page.rows,
          total: resPortList?.page.records,
          showTotal: total => `총 ${formatNumber(total)}개`,
          onChange: page => {
            getPortList({ deviceId, page, pageSize: DEFAULT_PAGE_SIZE });
          },
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ant-table-wrapper {
    height: 100%;
    border-bottom: none;

    .ant-table-thead > tr > th {
      padding: 0.6rem 1.2rem;
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
    }

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
      padding: 1.6rem 1.2rem;
      font-size: 18px;
      background-color: ${themeGet('colors.bgDescriptionsContent')};
      color: ${themeGet('colors.textDescriptionsContent')};
    }

    .ant-table-tbody > tr:not(:last-child) > td {
      border-bottom: 1px solid ${themeGet('colors.borderTableBottom')};
    }

    .ant-table-tbody > tr:last-child > td {
      border-bottom: none;
    }

    .ant-table-cell {
      a {
        color: ${themeGet('colors.textTableDevice')};
      }
    }
  }
`;

export default NetworkTypeSection;

import { useAppSelector } from '@/app/hooks';
import { ResPort } from '@/features/configPerfPage/types';
import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

const PortList = () => {
  const {
    config: { resPortList },
  } = useAppSelector(store => store.configPerf);

  const columns = useMemo<TableColumnsType<ResPort>>(
    () => [
      {
        title: '포트번호',
        dataIndex: 'portKey',
        key: 'portKey',
        width: '15%',
      },
      {
        title: '연결 장비',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
      },
      {
        title: '연결 장비 IP 주소',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        ellipsis: true,
      },
      {
        title: '상태',
        dataIndex: 'fault',
        key: 'fault',
        ellipsis: true,
        width: '15%',
      },
    ],
    [],
  );

  return (
    <Wrapper>
      <Table<ResPort>
        style={{ maxWidth: 500 }}
        size="small"
        rowKey="portKey"
        columns={columns}
        dataSource={resPortList || []}
        pagination={{ position: ['bottomCenter'] }}
      />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .ant-table-wrapper {
    height: 100%;

    .ant-table-thead {
      .ant-table-cell {
        background-color: ${themeGet('colors.bgPopover')};
        color: ${themeGet('colors.textDescriptionsLabel')};
        border-bottom: 1px solid #B7B7B7;
        border-right: none;
      }
    }

    .ant-table-tbody {
      .ant-table-cell {
        background-color: ${themeGet('colors.bgPopover')};
        color: ${themeGet('colors.textMain')};
        border-bottom: 1px solid ${themeGet('colors.borderTableBottom')};
      }
    }

    .ant-table-pagination {
      flex: none;
    }
  }
`;

export default PortList;

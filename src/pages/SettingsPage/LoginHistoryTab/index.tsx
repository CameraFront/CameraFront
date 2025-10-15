import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getLoginHistory } from '@/features/settingsPage/settingsSliceThunks';
import { ResLoginHistoryRecord } from '@/features/settingsPage/types';
import { SettingsTab } from '@/types/enum';
import { formatNumber } from '@/utils/formatters';
import themeGet from '@styled-system/theme-get';
import { DatePicker, DatePickerProps, Table, TableColumnsType } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const LoginHistoryTab = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    selectedTab,
    loginHistoryTab: { loginHistory },
  } = useAppSelector(store => store.settings);

  const [selectedRow, setSelectedRow] = useState<Key[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const columns = useMemo<TableColumnsType<ResLoginHistoryRecord>>(() => {
    return [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        width: '5%',
      },
      {
        title: '사용자ID',
        dataIndex: 'userId',
        key: 'userId',
        ellipsis: true,
      },
      {
        title: '사용자명',
        dataIndex: 'userNm',
        key: 'userNm',
        ellipsis: true,
      },
      {
        title: '로그인 일시',
        dataIndex: 'loginDate',
        key: 'loginDate',
        ellipsis: true,
      },

      {
        title: '접속 IP주소',
        dataIndex: 'userIp',
        key: 'userIp',
        width: '20%',
        ellipsis: true,
      },
    ];
  }, []);

  const disabledDate = useCallback<
    NonNullable<DatePickerProps['disabledDate']>
  >(current => {
    return current && current > dayjs().endOf('day');
  }, []);

  useEffect(() => {
    if (selectedTab !== SettingsTab.LoginHistoryTab) return;

    dispatch(getLoginHistory({ page: 1 }));
  }, [selectedTab]);

  useEffect(() => {
    dispatch(getLoginHistory({ selectedDate, page: 1 }));
  }, [selectedDate]);

  if (!loginHistory) return null;

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <DatePicker
            value={selectedDate}
            onChange={value => {
              setSelectedDate(value);
            }}
            disabledDate={disabledDate}
          />
        </div>
        <div className="right-wrapper"></div>
      </div>
      <div className="content">
        <Table
          bordered
          size="small"
          rowKey="no"
          columns={columns}
          dataSource={loginHistory.loginHistList}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: loginHistory.page.page,
            pageSize: loginHistory.page.rows,
            total: loginHistory.page.records,
            showTotal: total =>
              `${(loginHistory.page.page - 1) * loginHistory.page.rows + 1}-${
                loginHistory.page.page * loginHistory.page.rows
              } / 총 ${formatNumber(total)}개`,
            onChange: page => {
              dispatch(getLoginHistory({ selectedDate, page }));
            },
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRow,
            onChange: selectedRowKeys => {
              setSelectedRow(selectedRowKeys);
            },
          }}
        />
      </div>
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

export default LoginHistoryTab;

import { TableColumnsType } from 'antd';
import { ResUnregisteredPhoneListData } from '@/types/api/dashboard';

export const columns: TableColumnsType<
  ResUnregisteredPhoneListData['listPhoneUnReg'][0]
> = [  
  {
    title: 'No.',
    dataIndex: 'no',
    key: 'no',
    ellipsis: true,
    width: '6%',
  },  
  {
    title: '소속',
    dataIndex: 'phoneDepth2',
    key: 'phoneDepth2',
    ellipsis: true,
  },
  {
    title: '내선번호',
    dataIndex: 'internalNum',
    key: 'internalNum',
    ellipsis: true,
  },
  {
    title: '발생일시',
    dataIndex: 'collectDateTime',
    key: 'collectDateTime',
    ellipsis: true,
  },
  {
    title: '상태',
    dataIndex: 'fault',
    key: 'fault',
    render: (_, record) => (
      <p>UNREG</p>
    ),
  },
];

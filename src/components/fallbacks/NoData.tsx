import { Empty } from 'antd';

const NoData = () => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="데이터 없음" />
  );
};

export default NoData;

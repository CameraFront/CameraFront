import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const RegularLoadingSpinner = (props: SpinProps) => (
  <Spin
    indicator={<LoadingOutlined style={{ fontSize: '2.4rem' }} />}
    {...props}
  />
);

export default RegularLoadingSpinner;

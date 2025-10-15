import { SyncOutlined } from '@ant-design/icons';
import IconButton from './IconButton';

interface Props {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

const SyncButton = ({ isLoading, disabled, onClick }: Props) => (
  <IconButton
    title="지금 동기화하기"
    type="default"
    icon={<SyncOutlined spin={isLoading} />}
    disabled={disabled}
    loading={isLoading}
    onClick={onClick}
  />
);

export default SyncButton;

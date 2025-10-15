import { ReactNode } from 'react';
import { Button, Popconfirm } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';

interface Props {
  children: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  loading: boolean;
  disabled: boolean;
  cancelText?: string;
}

const DangerConfirmButton = ({
  title = '정말 해당 데이터를 삭제하시겠습니까?',
  description = '삭제된 데이터는 복구할 수 없습니다.',
  loading,
  disabled,
  onConfirm,
  cancelText = '취소',
  children,
}: Props) => (
  <Wrapper
    title={title}
    description={description}
    onConfirm={onConfirm}
    okButtonProps={{ loading, danger: true }}
    okText={children}
    cancelText={cancelText}
  >
    <Button disabled={disabled} className="btn-delete">
      {children}
    </Button>
  </Wrapper>
);

const Wrapper = styled(Popconfirm)`
  .btn-delete {
    &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
      color: ${themeGet('colors.textDanger')};
      border-color: ${themeGet('colors.textDanger')};
    }
  }
`;

export default DangerConfirmButton;

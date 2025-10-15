import { Dropdown, Flex, MenuProps } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import ExcelSymbol from '@/assets/icon__excel.svg?react';

interface Props {
  items: MenuProps['items'];
}

const ImportExportGroup = ({ items }: Props) => (
  <Dropdown menu={{ items }}>
    <Flex align="center" gap={4}>
      <ExcelSymbol style={{ fontSize: 20 }} />
      <CaretDownOutlined />
    </Flex>
  </Dropdown>
);

export default ImportExportGroup;

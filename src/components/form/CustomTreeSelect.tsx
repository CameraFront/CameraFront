import { useCallback } from 'react';
import { TreeSelect, TreeSelectProps } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';

type FilterTreeNodeFunction = NonNullable<
  Extract<TreeSelectProps['filterTreeNode'], Function>
>;

interface Props extends TreeSelectProps {
  isLoadingUpdate: boolean;
  treeData: NonNullable<TreeSelectProps['treeData']>;
  onDropdownVisibleChange?: NonNullable<
    TreeSelectProps['onDropdownVisibleChange']
  >;
  multiple?: boolean;
}

const TagLike = styled.span`
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  display: flex;
  align-self: center;
  flex: none;
  box-sizing: border-box;
  max-width: 100%;
  height: 24px;
  margin-top: 2px;
  margin-bottom: 2px;
  line-height: 22px;
  border-radius: 4px;
  cursor: default;
  transition:
    font-size 0.3s,
    line-height 0.3s,
    height 0.3s;
  margin-inline-end: 4px;
  padding-inline-start: 6px;
  padding-inline-end: 6px;
  font-weight: normal;
  position: relative;
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const tagRender: NonNullable<TreeSelectProps['tagRender']> = props => (
  <TagLike>{props.label}</TagLike>
);

const CustomTreeSelect = ({
  isLoadingUpdate,
  treeData,
  onDropdownVisibleChange,
  multiple = true,
  ...props
}: Props) => {
  // 트리 데이터를 value가 아닌 title로 필터링
  const filterTreeNode = useCallback<FilterTreeNodeFunction>(
    (inputValue, treeNode) =>
      treeNode?.title
        ?.toString()
        .toLowerCase()
        .includes(inputValue.toLowerCase()) || false,
    [],
  );

  return (
    <TreeSelect
      showSearch
      autoClearSearchValue
      multiple={multiple}
      treeDefaultExpandAll
      treeCheckable={multiple}
      showCheckedStrategy="SHOW_PARENT"
      loading={isLoadingUpdate}
      disabled={isLoadingUpdate}
      treeData={treeData}
      filterTreeNode={filterTreeNode}
      onDropdownVisibleChange={onDropdownVisibleChange}
      tagRender={tagRender}
      {...props}
    />
  );
};

export default CustomTreeSelect;

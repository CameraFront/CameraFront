import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Input, InputProps, Tree, TreeDataNode } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import SimpleBar from 'simplebar-react';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useGetParentBranchListQuery } from '@/services/api/common';
import { intIdSchema } from '@/services/validation/common';
import { TreeNode } from '@/types/common';
import {
  generateRegularTreeData,
  getExpandedKeys,
  getParentKey,
} from '@/utils/helpers';

const { DirectoryTree } = Tree;
const { Search } = Input;

interface Props {
  checkIfSelectable?: (selectedNode: TreeDataNode) => boolean;
  disabled?: boolean;
}

const RegularSearchableTree = ({
  disabled = false,
  checkIfSelectable,
}: Props) => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { pathname } = useLocation();
  const parsedBranchId = intIdSchema.parse(branchId);
  const {
    data: parentBranchList,
    isLoading: isLoadingParentBranchList,
    isError: isErrorParentBranchList,
  } = useGetParentBranchListQuery();
  const [search, setSearch] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const originalTreeData = useMemo(() => {
    if (!parentBranchList) return [];
    return generateRegularTreeData(parentBranchList);
  }, [parentBranchList]);

  const treeData = useMemo(() => {
    if (!search) return originalTreeData;

    const loop = (data: TreeNode[]): TreeNode[] =>
      data.map(item => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(search.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + search.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="matched-text" style={{ color: 'red' }}>
                {strTitle.substring(index, index + search.length)}
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );

        if (item.children) {
          return {
            ...item,
            title,
            children: loop(item.children),
          };
        }

        return {
          ...item,
          title,
          key: item.key,
        };
      });

    return loop(originalTreeData);
  }, [originalTreeData, search]);

  const onSelect = useCallback<NonNullable<DirectoryTreeProps['onSelect']>>(
    (selectedKeys, { selectedNodes }) => {
      if (!parentBranchList) return;
      const newExpandedKeys = getExpandedKeys(
        parentBranchList,
        selectedKeys[0] as number,
      );
      setExpandedKeys(newExpandedKeys);

      if (checkIfSelectable && !checkIfSelectable(selectedNodes[0])) return;

      const newPaths = pathname.split('/').slice(0, 3);
      navigate(`${newPaths.join('/')}/${selectedKeys[0]}`);
    },
    [navigate, parentBranchList, pathname, checkIfSelectable],
  );

  const onExpand = useCallback<NonNullable<DirectoryTreeProps['onExpand']>>(
    newExpandedKeys => {
      setExpandedKeys(newExpandedKeys as number[]);
      setAutoExpandParent(false);
    },
    [setExpandedKeys],
  );

  const onSearchChange: NonNullable<InputProps['onChange']> = useCallback(
    e => {
      if (!parentBranchList) return;

      const { value } = e.target;
      const newExpandedKeys = parentBranchList
        .map(item => {
          const { managementNm } = item;
          if (
            managementNm
              .toLowerCase()
              .indexOf((value as string).toLowerCase()) > -1
          ) {
            return getParentKey(item.managementCd, originalTreeData);
          }

          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      setExpandedKeys(newExpandedKeys as number[]);
      setSearch(value);
      setAutoExpandParent(true);
    },
    [parentBranchList, originalTreeData],
  );

  useEffect(() => {
    if (!parentBranchList || !parsedBranchId) return;
    const newExpandedKeys = getExpandedKeys(parentBranchList, parsedBranchId);
    setExpandedKeys(newExpandedKeys);
  }, [parentBranchList, parsedBranchId]);

  return (
    <Wrapper>
      <div className="tree-wrapper" data-disabled={disabled}>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="트리 검색"
          className="search-bar"
          onChange={onSearchChange}
          allowClear
        />
        <SimpleBar className="scroll-wrapper">
          {isLoadingParentBranchList ? (
            <div className="spinner-wrapper">
              <RegularLoadingSpinner spinning={isLoadingParentBranchList} />
            </div>
          ) : isErrorParentBranchList ? (
            <ErrorMessage style={{ height: 200 }} />
          ) : (
            <DirectoryTree<TreeNode>
              blockNode
              expandedKeys={expandedKeys}
              onSelect={onSelect}
              onExpand={onExpand}
              autoExpandParent={autoExpandParent}
              treeData={treeData}
              selectedKeys={[Number(branchId)]}
            />
          )}
        </SimpleBar>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.aside`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  .ant-input-wrapper {
    border-radius: ${themeGet('borderRadius.normal')};

    .ant-input-affix-wrapper {
      border: 1px solid ${themeGet('colors.borderInput')};
      background-color: ${themeGet('colors.bgInput')};
    }
    .ant-input-group-addon button {
      border: 1px solid ${themeGet('colors.borderInput')};
      background-color: ${themeGet('colors.bgInputBtn')};
    }
  }

  .tree-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &[data-disabled='true'] {
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    }
  }

  .search-bar {
    /* max-width: 20rem; */
  }

  .ant-tree.ant-tree-directory {
    flex: 1;
    max-height: calc(100vh - 200px);
    height: 100%;
    overflow: overlay;
    background-color: ${themeGet('colors.bgTree')};

    .ant-tree-treenode {
      white-space: nowrap;
      /* width: fit-content; */
      color: ${themeGet('colors.textTree')};

      &::before {
        border-radius: ${themeGet('borderRadius.normal')};
      }

      .ant-tree-node-content-wrapper.ant-tree-node-selected {
        color: ${themeGet('colors.textTreeSelected')};
      }
    }

    .ant-tree-treenode-selected {
      .ant-tree-switcher {
        color: ${themeGet('colors.textTreeSelected')};
      }

      &::before {
        background: ${themeGet('colors.bgTreeItemSelected')};
      }
    }
  }

  .scroll-wrapper {
    height: 100%;
    max-height: calc(100vh - 212px);

    .spinner-wrapper {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
export default RegularSearchableTree;

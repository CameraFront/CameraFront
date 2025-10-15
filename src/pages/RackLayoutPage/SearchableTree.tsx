import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, InputProps, Popconfirm, Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import SimpleBar from 'simplebar-react';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  createRackLayoutNode,
  deleteRackLayoutNode,
  setSelectedBranch,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { useGetParentBranchListQuery } from '@/services/api/common';
import {
  useGetRackLayoutMapListQuery,
  useLazyGetRackLayoutMapListQuery,
} from '@/services/api/rackLayout';
import { TreeNode } from '@/types/common';
import { generateRackLayoutTreeData, getParentKey } from '@/utils/helpers';

const { DirectoryTree } = Tree;
const { Search } = Input;

const SearchableTree = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isEditMode,
    tree: { selectedBranch },
  } = useAppSelector(store => store.rackLayout);
  const { data: parentBranchList } = useGetParentBranchListQuery();
  const [getRackLayoutMapList] = useLazyGetRackLayoutMapListQuery();
  const { data: rackLayoutMapList } = useGetRackLayoutMapListQuery();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  const rackLayoutMapTree = useMemo(() => {
    if (!rackLayoutMapList || !parentBranchList) return [];
    return generateRackLayoutTreeData(parentBranchList, rackLayoutMapList);
  }, [rackLayoutMapList, parentBranchList]);

  const treeData = useMemo(() => {
    if (!searchValue) {
      setExpandedKeys([]);
      return rackLayoutMapTree;
    }

    const loop = (data: TreeNode[]): TreeNode[] =>
      data.map(item => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="matched-text" style={{ color: 'red' }}>
                {strTitle.substring(index, index + searchValue.length)}
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

    return loop(rackLayoutMapTree);
  }, [rackLayoutMapTree, searchValue]);

  // 트리의 expandedKeys, selectedTreeNode 초깃값 설정
  const initTreeNode = useCallback(() => {
    if (!parentBranchList || !rackLayoutMapList) return;

    const initialSelectedMap = rackLayoutMapList[0];
    dispatch(
      setSelectedBranch({
        key: initialSelectedMap.seqNum,
        title: initialSelectedMap.rackNm,
        parentKey: initialSelectedMap.managementCd,
        isLeaf: true,
      }),
    );

    const parentKeys = parentBranchList
      .find(branch => branch.managementCd === initialSelectedMap.managementCd)
      ?.path.split('/')
      .slice(1);
    setExpandedKeys(parentKeys?.map(key => Number(key)) || []);
  }, [dispatch, parentBranchList, rackLayoutMapList]);

  const onSelect = useCallback<NonNullable<DirectoryTreeProps['onSelect']>>(
    (_selectedKeys, info) => {
      dispatch(setSelectedBranch(info.selectedNodes[0] as TreeNode));
    },
    [dispatch],
  );

  const onExpand = useCallback<NonNullable<DirectoryTreeProps['onExpand']>>(
    newExpandedKeys => {
      setExpandedKeys(newExpandedKeys);
      setAutoExpandParent(false);
    },
    [],
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
            return getParentKey(item.managementCd, rackLayoutMapTree);
          }

          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      setExpandedKeys(newExpandedKeys as Key[]);
      setSearchValue(value);
      setAutoExpandParent(true);
    },
    [parentBranchList, rackLayoutMapTree],
  );

  const handleAddBranch = useCallback(async () => {
    await dispatch(createRackLayoutNode());
    await getRackLayoutMapList();
  }, [dispatch, getRackLayoutMapList]);

  const handleDeleteBranch = useCallback(async () => {
    await dispatch(deleteRackLayoutNode());
    await getRackLayoutMapList();
    initTreeNode();
  }, [dispatch, getRackLayoutMapList, initTreeNode]);

  useEffect(() => {
    if (!parentBranchList || !rackLayoutMapList) return;
    if (initialized) return;

    initTreeNode();
    setInitialized(true);
  }, [initTreeNode, initialized, parentBranchList, rackLayoutMapList]);

  return (
    <Wrapper>
      <div className="tree-wrapper">
        <Search
          style={{ marginBottom: 8 }}
          placeholder="검색"
          className="search-bar"
          onChange={onSearchChange}
          allowClear
        />
        <SimpleBar
          style={{
            maxHeight: !isEditMode
              ? 'calc(100vh - 206px)'
              : 'calc(100vh - 260px)',
          }}
        >
          <DirectoryTree
            blockNode
            expandedKeys={expandedKeys}
            onSelect={onSelect}
            onExpand={onExpand}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            selectedKeys={selectedBranch ? [selectedBranch.key] : []}
          />
        </SimpleBar>
      </div>
      {isEditMode && (
        <div className="button-group">
          <Popconfirm
            title="랙실장도맵 삭제하기"
            description="정말 선택된 랙실장도맵을 삭제하시겠습니까?"
            onConfirm={handleDeleteBranch}
            okButtonProps={{ loading: isLoading, danger: true }}
            okText="삭제"
            cancelText="취소"
          >
            <Button disabled={!selectedBranch?.isLeaf}>맵 삭제</Button>
          </Popconfirm>
          <Button
            type="primary"
            disabled={selectedBranch?.isLeaf}
            onClick={handleAddBranch}
          >
            맵 추가
          </Button>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  height: 100%;
  overflow: hidden;

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
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .search-bar {
    /* max-width: 20rem; */
  }

  .ant-tree.ant-tree-directory {
    background-color: ${themeGet('colors.bgTree')};

    .ant-tree-treenode {
      white-space: nowrap;
      /* width: fit-content; */
      color: #707070;

      &::before {
        border-radius: ${themeGet('borderRadius.normal')};
      }

      .ant-tree-node-content-wrapper {
        padding-left: 0;

        .ant-tree-title {
          padding-left: 0.5rem;
        }
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

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
`;
export default SearchableTree;

import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, InputProps, message, Modal, Popconfirm, Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import SimpleBar from 'simplebar-react';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  createTopologyNode,
  deleteTopologyNode,
  setSelectedTreeNode,
} from '@/features/topologyPage/topologySlice';
import { useCheckPwdQuery, useGetParentBranchListQuery } from '@/services/api/common';
import {
  useGetTopologyMapListQuery,
  useLazyGetTopologyMapListQuery,
} from '@/services/api/topology';
import { TreeNode } from '@/types/common';
import { generateTopologyTreeData, getParentKey } from '@/utils/helpers';

const { DirectoryTree } = Tree;
const { Search } = Input;

const SearchableTree = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isEditMode,
    tree: { selectedTreeNode },
  } = useAppSelector(store => store.topology);
  const { data: parentBranchList } = useGetParentBranchListQuery();
  const [getTopologyMapList] = useLazyGetTopologyMapListQuery();
  const { data: topologyMapList } = useGetTopologyMapListQuery();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isPasswordChecked, setIsPasswordChecked] = useState<boolean>(false);
  const { data }= useCheckPwdQuery({ pwd: password }, {
    skip: !isPasswordChecked,
  });

  const topologyMapTree = useMemo(() => {
    if (!topologyMapList || !parentBranchList) return [];
    return generateTopologyTreeData(parentBranchList, topologyMapList);
  }, [topologyMapList, parentBranchList]);

  const treeData = useMemo(() => {
    if (!searchValue) {
      setExpandedKeys([]);
      return topologyMapTree;
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

    return loop(topologyMapTree);
  }, [topologyMapTree, searchValue]);

  // 트리의 expandedKeys, selectedTreeNode 초깃값 설정
  const initTreeNode = useCallback(() => {
    if (!parentBranchList || !topologyMapList) return;

    const initialSelectedMap = topologyMapList[0];
    dispatch(
      setSelectedTreeNode({
        key: initialSelectedMap.seqNum,
        title: initialSelectedMap.topologyNm,
        parentKey: initialSelectedMap.managementCd,
        isLeaf: true,
      }),
    );

    const parentKeys = parentBranchList
      .find(branch => branch.managementCd === initialSelectedMap.managementCd)
      ?.path.split('/')
      .slice(1);
    setExpandedKeys(parentKeys?.map(key => Number(key)) || []);
  }, [dispatch, parentBranchList, topologyMapList]);

  const onSelect = useCallback<NonNullable<DirectoryTreeProps['onSelect']>>(
    (_selectedKeys, info) => {
      dispatch(setSelectedTreeNode(info.selectedNodes[0] as TreeNode));
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
            return getParentKey(item.managementCd, topologyMapTree);
          }

          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      setExpandedKeys(newExpandedKeys as Key[]);
      setSearchValue(value);
      setAutoExpandParent(true);
    },
    [parentBranchList, topologyMapTree],
  );

  const handleAddBranch = useCallback(async () => {
    await dispatch(createTopologyNode());
    await getTopologyMapList();
  }, [dispatch, getTopologyMapList]);

  const handleDeleteBranch = useCallback(async () => {
    await dispatch(deleteTopologyNode());
    await getTopologyMapList();
    initTreeNode();
  }, [dispatch, getTopologyMapList, initTreeNode]);

  const handleCheckResult = () => {
    if (data?.result == "fail") {
      message.error("비밀번호가 틀렸습니다. 다시 입력해주세요.");
      setPassword(''); 
      setIsPasswordChecked(false);
    } else {
      handleDeleteBranch();
      setIsModalOpen(false); 
      setPassword(''); 
    }
  };

  const handleCheck =  useCallback(async () => {
    await setIsPasswordChecked(true); 
    await handleCheckResult();
  }, [isPasswordChecked]);

  useEffect(() => {
    if (!parentBranchList || !topologyMapList) return;
    if (initialized) return;

    initTreeNode();
    setInitialized(true);
  }, [initTreeNode, initialized, parentBranchList, topologyMapList]);

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
            selectedKeys={selectedTreeNode ? [selectedTreeNode.key] : []}
          />
        </SimpleBar>
      </div>
      {isEditMode && (
        <div className="button-group">
          {/* <Popconfirm
            title="토폴로지맵 삭제하기"
            description="정말 선택된 토폴로지맵을 삭제하시겠습니까?"
            onConfirm={handleDeleteBranch}
            okButtonProps={{ loading: isLoading, danger: true }}
            okText="삭제"
            cancelText="취소"
          > */}
          <Button 
            disabled={!selectedTreeNode?.isLeaf} 
            onClick={()=> setIsModalOpen(true)}
          >
            맵 삭제
          </Button>
          {/* </Popconfirm> */}
          <Modal
            width={500}
            centered
            title="비밀번호 확인"
            open={isModalOpen}
            destroyOnClose
            okText="확인"
            cancelText="취소"
            onOk={handleCheck}
            onCancel={() => {
              setIsModalOpen(false);
              setPassword('')
            }}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </Modal>
          <Button
            type="primary"
            disabled={selectedTreeNode?.isLeaf}
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
      color: ${themeGet('colors.textTree')};

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

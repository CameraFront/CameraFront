import { Key } from 'react';
import { TreeDataNode } from 'antd';
import { ZodIssue } from 'zod';
import { ResParentBranchList } from '@/types/api/common';
import { ResRackLayoutMapList } from '@/types/api/rackLayout';
import { ResTopologyMapList } from '@/types/api/topology';
import {
  BreadcrumbItem,
  CommonTree,
  PathOfBranch,
  ReqBodyParams,
  ResTopologyTreeNode,
  ResTreeNode,
  TopologyPathOfBranch,
  TreeNode,
} from '@/types/common';
import { ROOT_KEY } from '@/config/constants';
import { QUERY_TAG_IDS } from '@/config';

// 랜덤 숫자 생성
export const generateRandomNumber = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

// 배열을 일정한 크기로 나누는 함수
export const sliceIntoChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  const res = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }

  return res;
};

// 트리에서 부모 노드들을 찾는 함수
export const findParentPath = (
  targetKey: string,
  children: ResTreeNode[] | ResTopologyTreeNode[],
  path: PathOfBranch | TopologyPathOfBranch = [],
): PathOfBranch | TopologyPathOfBranch | undefined => {
  for (const node of children) {
    if (node.key === targetKey) {
      const { title, key, realKey, type } = node;
      return [...path, { title, key, realKey, type }] as
        | PathOfBranch
        | TopologyPathOfBranch;
    }

    if (node.children) {
      const { title, key, realKey, type } = node;
      const found = findParentPath(targetKey, node.children, [
        ...path,
        { title, key, realKey, type },
      ] as PathOfBranch | TopologyPathOfBranch);

      if (found) {
        return found;
      }
    }
  }
};

// 트리에서 특정 노드를 id로 찾는 함수
export const findDeviceNodeById = (
  tree: ResTreeNode[],
  value: string | number,
): ResTreeNode | null => {
  for (const node of tree) {
    if (node.type === 'dv' && node.realKey === value.toString()) {
      return node;
    }

    if (node.children) {
      const found = findDeviceNodeById(node.children, value);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

// Branch Type에 따라 POST Method의 Request Body를 생성하는 함수
export const getDeviceParamFromBranch = (
  branch: ResTreeNode,
): Omit<ReqBodyParams, 'fromDate' | 'endDate'> => {
  const body: Record<string, string | number> = {};

  switch (branch.type) {
    case 'hq':
      body.managementCd = parseInt(branch.realKey);
      break;
    case 'st':
      body.stationCd = branch.realKey;
      break;
    case 'dk':
      body.stationCd = branch.parentKey || '';
      body.deviceKind = parseInt(branch.realKey);
      break;
    case 'dv':
      body.deviceKey = parseInt(branch.realKey);
      break;
    default:
      break;
  }

  return body;
};

// Path에 따라 POST Method의 Request Body를 생성하는 함수
export const getDeviceParamFromPath = (
  pathArr: PathOfBranch,
): Omit<ReqBodyParams, 'fromDate' | 'endDate'> => {
  const body: Record<string, string | number> = {};

  pathArr.forEach(path => {
    switch (path.type) {
      case 'hq':
        body.managementCd = parseInt(path.realKey);
        break;
      case 'st':
        body.stationCd = path.realKey;
        break;
      case 'dk':
        body.deviceKind = parseInt(path.realKey);
        break;
      case 'dv':
        body.deviceKey = parseInt(path.realKey);
        break;
      default:
        break;
    }
  });

  return body;
};

// 디바운스 함수
export const debounce = <T extends any[]>(
  func: (...args: T) => void,
  delay: number,
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 트리를 깊이에 따라 잘라내는 함수
export const trimTreeByDepth = (
  node: ResTreeNode,
  depth: number = 0,
  maxDepth: number = 1,
): ResTreeNode => {
  if (depth === maxDepth) {
    const { children, ...rest } = node;
    return rest;
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child =>
        trimTreeByDepth(child, depth + 1, maxDepth),
      ),
    };
  }

  return node;
};

// 파일 다운로드 함수
export const downloadFile = (
  blob: Blob,
  filename: string,
  extension: string,
): void => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.${extension}`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

// 트리에서 초기 노드를 찾는 함수
export const getInitialNode = <T extends CommonTree>(
  node: T,
  depth: number = 1,
): T => {
  if (depth === 1) {
    return node;
  }

  if (node.children && node.children.length) {
    return getInitialNode(node.children[0] as T, depth - 1);
  }

  return node;
};

// 트리를 배열로 변환하는 함수
export const generateList = (
  data: (ResTreeNode | ResTopologyTreeNode)[],
): Omit<ResTreeNode | ResTopologyTreeNode, 'children'>[] => {
  const dataList = [];

  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { children, ...rest } = node;
    dataList.push(rest);

    if (node.children) {
      dataList.push(...generateList(node.children));
    }
  }

  return dataList;
};

// 트리에서 부모 키를 찾는 함수
export const getParentKey = (
  key: Key,
  tree: TreeDataNode[],
): Key | undefined => {
  let parentKey;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }

  return parentKey;
};

export const delay = (timeout: number) =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

export const zodErrorSerializer = (issues: ZodIssue[]): string =>
  issues.map(issue => `[${issue.path}] ${issue.message}`).join('\n') ||
  `Failed to validate schema`;

export const generateTopologyTreeData = (
  parentBranchList: ResParentBranchList,
  mapList: ResTopologyMapList,
): TreeNode[] => {
  const nodeMap: Record<string, TreeNode> = {};

  parentBranchList.forEach(branch => {
    nodeMap[branch.managementCd] = {
      key: branch.managementCd,
      title: branch.managementNm,
      parentKey: branch.parentNode ? branch.parentNode : null,
      isLeaf: false,
      children: [],
    };
  });

  mapList.forEach(leaf => {
    const leafNode: TreeNode = {
      key: leaf.seqNum,
      title: leaf.topologyNm,
      parentKey: leaf.managementCd,
      isLeaf: true,
    };

    if (nodeMap[leaf.managementCd]) {
      nodeMap[leaf.managementCd].children?.push(leafNode);
    }
  });

  const treeData: TreeNode[] = [];
  Object.values(nodeMap).forEach(node => {
    if (!node.parentKey) {
      treeData.push(node);
    } else if (nodeMap[node.parentKey]) {
      nodeMap[node.parentKey].children?.push(node);
    }
  });

  return treeData;
};

export const generateRackLayoutTreeData = (
  parentBranchList: ResParentBranchList,
  mapList: ResRackLayoutMapList,
): TreeNode[] => {
  const nodeMap: Record<string, TreeNode> = {};

  parentBranchList.forEach(branch => {
    nodeMap[branch.managementCd] = {
      key: branch.managementCd,
      title: branch.managementNm,
      parentKey: branch.parentNode ? branch.parentNode : null,
      isLeaf: false,
      children: [],
    };
  });

  mapList.forEach(leaf => {
    const leafNode: TreeNode = {
      key: leaf.seqNum,
      title: leaf.rackNm,
      parentKey: leaf.managementCd,
      isLeaf: true,
    };

    if (nodeMap[leaf.managementCd]) {
      nodeMap[leaf.managementCd].children?.push(leafNode);
    }
  });

  const treeData: TreeNode[] = [];
  Object.values(nodeMap).forEach(node => {
    if (!node.parentKey) {
      treeData.push(node);
    } else if (nodeMap[node.parentKey]) {
      nodeMap[node.parentKey].children?.push(node);
    }
  });

  return treeData;
};

export const generateRegularTreeData = (
  branchList: ResParentBranchList,
): TreeNode[] => {
  const nodeMap: Record<string, TreeNode> = {
    [ROOT_KEY]: {
      key: ROOT_KEY,
      title: '전체',
      parentKey: null,
      isLeaf: false,
      children: [],
    },
  };

  branchList.forEach(branch => {
    nodeMap[branch.managementCd] = {
      key: branch.managementCd,
      title: branch.managementNm,
      parentKey: branch.parentNode ? branch.parentNode : ROOT_KEY,
      isLeaf: false,
      children: [],
    };
  });

  const treeData: TreeNode[] = [];
  Object.values(nodeMap).forEach(node => {
    if (node.parentKey === null) {
      treeData.push(node);
    } else if (nodeMap[node.parentKey]) {
      nodeMap[node.parentKey].children?.push(node);
    }
  });

  const setLeafNodes = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (!node.children?.length) {
        node.isLeaf = true;
      } else if (node.children) {
        setLeafNodes(node.children);
      }
    });
  };

  setLeafNodes(treeData);

  return treeData;
};

export const findBreadcrumbItem = (
  branchList: ResParentBranchList,
  selectedTreeNode: TreeNode,
): BreadcrumbItem[] => {
  const ancestors: BreadcrumbItem[] = [
    { key: selectedTreeNode.key, title: selectedTreeNode.title },
  ];

  if (!selectedTreeNode.parentKey) return ancestors;

  const traverse = (parentKey: number) => {
    const found = branchList.find(branch => branch.managementCd === parentKey);
    if (found) {
      ancestors.push({ key: found.managementCd, title: found.managementNm });

      if (found.parentNode) {
        traverse(found.parentNode);
      }
    }
  };

  traverse(selectedTreeNode.parentKey);

  return ancestors.reverse();
};

export const findNodeInTree = (tree: TreeNode[], key: Key): TreeNode | null => {
  for (const node of tree) {
    if (node.key === key) {
      return node;
    }

    if (node.children) {
      const found = findNodeInTree(node.children, key);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

export const getExpandedKeys = (
  list: ResParentBranchList,
  selectedKey: number,
) => {
  const found = list?.find(item => item.managementCd === selectedKey);

  if (!found) return [];
  if (!found.parentNode) return [ROOT_KEY, selectedKey];
  const foundParentKey = [
    ROOT_KEY,
    ...found.path.split('/').slice(1).map(Number),
  ];
  return foundParentKey;
};

export const getQueryTagWithParams = (
  tagId: keyof typeof QUERY_TAG_IDS.Settings,
  params: any,
) => `${tagId}-${JSON.stringify(params)}`;

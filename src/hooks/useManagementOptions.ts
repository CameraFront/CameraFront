import { useCallback, useEffect, useState } from 'react';
import { useLazyGetParentBranchListQuery } from '@/services/api/common';
import { CascaderOption, ResParentBranch } from '@/types/api/common';
import { ROOT_KEY } from '@/config/constants';

const ROOT_OPTION = {
  label: '최상위 소속',
  value: ROOT_KEY,
  depth: 0,
  isLeaf: false,
  children: undefined,
};

type Props = {
  hasRoot?: boolean;
  initialValues?: (number | null)[];
} | void;

const useManagementOptions = (props?: Props) => {
  const hasRoot = props?.hasRoot ?? false;
  const initialValues = props?.initialValues;
  const [isInitialized, setIsInitialized] = useState(false);
  const [options, setOptions] = useState<CascaderOption[]>(
    hasRoot ? [ROOT_OPTION] : [],
  );
  const [getParentBranchList, { isLoading: isLoadingCascader }] =
    useLazyGetParentBranchListQuery();

  const transformData = useCallback(
    (data: ResParentBranch[]) =>
      data.map(item => ({
        label: item.managementNm,
        value: item.managementCd,
        depth: item.depth,
        isLeaf: item.endNode === 'Y',
      })),
    [],
  );

  const updateNodeChildren = useCallback(
    (
      prevOptions: CascaderOption[],
      targetValue: number | undefined,
      newChildren: CascaderOption[],
    ): CascaderOption[] =>
      prevOptions.map(option => {
        if (option.value === targetValue) {
          if (newChildren.length === 0) {
            return {
              ...option,
              isLeaf: true,
            };
          }

          return {
            ...option,
            isLeaf: false,
            children: newChildren,
          };
        }

        if (option.children) {
          return {
            ...option,
            children: updateNodeChildren(
              option.children,
              targetValue,
              newChildren,
            ),
          };
        }
        return option;
      }),
    [],
  );

  const loadOptions = useCallback(
    async (selectedValues: (number | null)[]) => {
      const depth = selectedValues.length + 1;
      const managementCdTree = !selectedValues.length
        ? undefined
        : selectedValues[selectedValues.length - 1];

      try {
        const data = await getParentBranchList({
          depth,
          managementCdTree: managementCdTree ?? undefined,
        }).unwrap();
        const transformedData = transformData(data);

        setOptions(prev => {
          if (!selectedValues.length) return prev;

          return updateNodeChildren(
            prev,
            managementCdTree ?? undefined,
            transformedData,
          );
        });
      } catch (error) {
        console.error('Failed to load cascader data:', error);
      }
    },
    [getParentBranchList, transformData, updateNodeChildren],
  );

  const initializeOptions = useCallback(
    async (parentNodes: (number | null)[]) => {
      try {
        const responses = await Promise.all(
          parentNodes.map(async (parentNode, i) =>
            getParentBranchList({
              depth: i + 1,
              managementCdTree: parentNode ?? undefined,
            }).unwrap(),
          ),
        );
        const initialOption: CascaderOption = ROOT_OPTION;

        responses.reduce((acc, cur, i) => {
          if (!acc) return acc;

          acc.children = transformData(cur);
          const childNode = acc.children?.find(
            child => child.value === parentNodes[i + 1],
          );
          return childNode ?? acc;
        }, initialOption as CascaderOption);

        setOptions(hasRoot ? [initialOption] : (initialOption.children ?? []));
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize cascader options:', error);
      }
    },
    [getParentBranchList, hasRoot, transformData],
  );

  useEffect(() => {
    if (isInitialized || !initialValues) return;

    initializeOptions(initialValues);
  }, [initializeOptions, initialValues, isInitialized]);

  return {
    options,
    loadOptions,
    isLoading: isLoadingCascader,
    isInitialized,
  };
};

export default useManagementOptions;

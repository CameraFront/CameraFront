import { useCallback, useMemo } from 'react';
import { App, FormInstance, TreeSelectProps } from 'antd';
import { useGetDeviceTypesByDepthsQuery } from '@/services/api/common';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { LayoutItem } from '@/types/api/dashboard';
import { ALL_ITEMS_SELECTED } from '@/config';

interface Props {
  form: FormInstance;
  id: string;
  data: LayoutItem['data'];
}

const useDeviceTypesField = ({ form, id, data }: Props) => {
  const { message } = App.useApp();
  const { data: deviceTypesByDepths } = useGetDeviceTypesByDepthsQuery();
  const [updateWidgetOptions] = useUpdateWidgetOptionsMutation();

  const onDeviceTypesValuesChange = useCallback(
    (deviceTypes: number[]) => {
      // 장비종류를 선택하지 않은 경우 '전체'로 강제 선택
      if (deviceTypes.length === 0) {
        message.warning('장비종류를 하나 이상 선택해야 합니다.');
        form.setFieldValue('deviceTypes', ALL_ITEMS_SELECTED.slice());
        return;
      }

      // 다른 장비종류들이 있는 상태에서 '전체'를 선택한 경우 '전체'만 선택
      if (deviceTypes[deviceTypes.length - 1] === 0) {
        form.setFieldValue('deviceTypes', ALL_ITEMS_SELECTED.slice());
        return;
      }

      // '전체'인데 다른 장비종류를 선택한 경우 '전체' 해제
      if (deviceTypes[0] === 0) {
        form.setFieldValue('deviceTypes', deviceTypes.slice(1));
        // eslint-disable-next-line no-useless-return
        return;
      }

      form.setFieldValue('deviceTypes', deviceTypes.slice().sort());
    },
    [form, message],
  );

  const treeData = useMemo(() => {
    if (!deviceTypesByDepths) return [];

    const deviceTypeOptions: TreeSelectProps['treeData'] = [
      {
        key: 0,
        value: 0,
        title: '전체',
        isLeaf: true,
      },
    ];

    deviceTypesByDepths.listDeviceKindDepth1.forEach(depth1 => {
      deviceTypeOptions.push({
        key: depth1.deviceKind,
        value: depth1.deviceKind,
        title: depth1.deviceKindNm,
        isLeaf: false,
        children: deviceTypesByDepths.listDeviceKindDepth2
          .filter(depth2 => depth2.deviceKind === depth1.deviceKind)
          .map(depth2 => ({
            key: depth2.deviceKindSub,
            value: depth2.deviceKindSub,
            title: depth2.deviceKindSubNm,
            isLeaf: true,
          })),
      });
    });

    return deviceTypeOptions;
  }, [deviceTypesByDepths]);

  const onDeviceTypesDropdownVisibleChange = useCallback<
    NonNullable<TreeSelectProps['onDropdownVisibleChange']>
  >(
    visible => {
      if (visible || !deviceTypesByDepths) return;

      const newOptions = form.getFieldsValue();
      const { deviceTypes } = newOptions;

      if (
        JSON.stringify(deviceTypes) === JSON.stringify(data.options.deviceTypes)
      )
        return;

      if (JSON.stringify(deviceTypes) === JSON.stringify(ALL_ITEMS_SELECTED)) {
        updateWidgetOptions({ id, options: newOptions });
        return;
      }

      const depth2Only: number[] = [];
      for (const deviceType of deviceTypes) {
        const depth2Found = deviceTypesByDepths.listDeviceKindDepth2.find(
          depth2 => depth2.deviceKindSub === deviceType,
        );

        if (!depth2Found) {
          const depth1Found = deviceTypesByDepths.listDeviceKindDepth1.find(
            depth1 => depth1.deviceKind === deviceType,
          );

          if (!depth1Found) {
            message.warning('잘못된 장비종류가 포함되어 있습니다.');
            break;
          }

          const depth2Children =
            deviceTypesByDepths.listDeviceKindDepth2.filter(
              depth2 => depth2.deviceKind === depth1Found.deviceKind,
            );

          depth2Only.push(
            ...depth2Children.map(depth2 => depth2.deviceKindSub),
          );
        } else {
          depth2Only.push(deviceType);
        }
      }

      updateWidgetOptions({
        id,
        options: { ...newOptions, deviceTypes: depth2Only },
      });
    },
    [
      form,
      id,
      updateWidgetOptions,
      deviceTypesByDepths,
      data.options.deviceTypes,
      message,
    ],
  );

  return {
    treeData,
    onDeviceTypesDropdownVisibleChange,
    onDeviceTypesValuesChange,
  };
};

export default useDeviceTypesField;

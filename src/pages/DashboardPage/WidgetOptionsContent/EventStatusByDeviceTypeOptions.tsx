import { useCallback, useMemo } from 'react';
import { App, Form, Select } from 'antd';
import { TreeSelectProps } from 'antd/lib';
import CustomTreeSelect, {
  tagRender,
} from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import useEventTypesField from '@/hooks/useEventTypesField';
import { useGetDeviceTypesByDepthsQuery } from '@/services/api/common';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { EventStatusByDeviceTypeWidgetData } from '@/types/api/dashboard';
import { NONE_SELECTED, WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: EventStatusByDeviceTypeWidgetData;
}

const EventStatusByDeviceTypeOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<EventStatusByDeviceTypeWidgetData['options']>();
  const [
    updateWidgetOptions,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateWidgetOptionsMutation();
  const { data: deviceTypesByDepths } = useGetDeviceTypesByDepthsQuery();

  const { onEventTypesValuesChange, onEventTypesDropdownVisibleChange } =
    useEventTypesField({
      form,
      id,
      data,
    });

  if (errorUpdate) {
    message.error(`[${data.title}] 위젯 설정 변경에 실패했습니다.`);
    console.error(
      `[${data.title}] 위젯 설정 변경에 실패했습니다.`,
      errorUpdate,
    );
  }

  const treeData = useMemo(() => {
    if (!deviceTypesByDepths) return [];

    const deviceTypeOptions: TreeSelectProps['treeData'] = [];

    deviceTypesByDepths.listDeviceKindDepth1.forEach(depth1 => {
      deviceTypeOptions.push({
        key: depth1.deviceKind,
        value: depth1.deviceKind,
        title: depth1.deviceKindNm,
        isLeaf: false,
        selectable: false,
        children: deviceTypesByDepths.listDeviceKindDepth2
          .filter(depth2 => depth2.deviceKind === depth1.deviceKind)
          .map(depth2 => ({
            key: depth2.deviceKindSub,
            value: depth2.deviceKindSub,
            title: depth2.deviceKindSubNm,
            isLeaf: true,
            selectable: true,
          })),
      });
    });

    return deviceTypeOptions;
  }, [deviceTypesByDepths]);

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류와 장애종류는 드랍다운 닫힐 때만 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<EventStatusByDeviceTypeWidgetData['options']>,
      allValues: EventStatusByDeviceTypeWidgetData['options'],
    ) => {
      const { eventTypes } = changedValues;

      if (eventTypes) {
        onEventTypesValuesChange(eventTypes);
        return;
      }

      updateWidgetOptions({ id, options: allValues });
    },
    [id, updateWidgetOptions, onEventTypesValuesChange],
  );

  return (
    <Form<EventStatusByDeviceTypeWidgetData['options']>
      form={form}
      layout="horizontal"
      name="eventStatusByDeviceTypeOptionsForm"
      autoComplete="off"
      initialValues={{
        ...data.options,
        deviceType:
          data.options.deviceType === NONE_SELECTED
            ? undefined
            : data.options.deviceType,
      }}
      onValuesChange={onValuesChange}
    >
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.updateIntervalShort.label}
        name="updateInterval"
        hidden
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.updateIntervalShort.options}
        />
      </WidgetFormItem>
      <WidgetFormItem label="장비종류" name="deviceType">
        <CustomTreeSelect
          isLoadingUpdate={isLoadingUpdate}
          treeData={treeData}
          multiple={false}
        />
      </WidgetFormItem>
      <WidgetFormItem label="장애종류" name="eventTypes">
        <Select
          mode="multiple"
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.eventTypes.options}
          onDropdownVisibleChange={onEventTypesDropdownVisibleChange}
          tagRender={tagRender}
        />
      </WidgetFormItem>
    </Form>
  );
};

export default EventStatusByDeviceTypeOptions;

import { useCallback } from 'react';
import { App, Form, Select } from 'antd';
import CustomTreeSelect, {
  tagRender,
} from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import useDeviceTypesField from '@/hooks/useDeviceTypesField';
import useEventTypesField from '@/hooks/useEventTypesField';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { EventStatusByDeviceTypesWidgetData } from '@/types/api/dashboard';
import { WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: EventStatusByDeviceTypesWidgetData;
}

const EventStatusByDeviceTypesOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<EventStatusByDeviceTypesWidgetData['options']>();
  const [
    updateWidgetOptions,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateWidgetOptionsMutation();
  const {
    treeData,
    onDeviceTypesValuesChange,
    onDeviceTypesDropdownVisibleChange,
  } = useDeviceTypesField({
    form,
    id,
    data,
  });
  const { onEventTypesValuesChange, onEventTypesDropdownVisibleChange } =
    useEventTypesField({
      form,
      id,
      data,
    });

  if (errorUpdate) {
    message.error(`[${data.title}] 위젯 설정 변경에 실패했습니다.`);
    console.error(
      `[${data.title}-${data.type}] 위젯 설정 변경에 실패했습니다.`,
      errorUpdate,
    );
  }

  const onValuesChange = useCallback(
    (
      changedValues: EventStatusByDeviceTypesWidgetData['options'],
      allValues: EventStatusByDeviceTypesWidgetData['options'],
    ) => {
      const { deviceTypes, eventTypes } = changedValues;

      if (deviceTypes) {
        onDeviceTypesValuesChange(deviceTypes);
        return;
      }
      if (eventTypes) {
        onEventTypesValuesChange(eventTypes);
        return;
      }

      updateWidgetOptions({ id, options: allValues });
    },
    [
      id,
      updateWidgetOptions,
      onDeviceTypesValuesChange,
      onEventTypesValuesChange,
    ],
  );

  return (
    <Form<EventStatusByDeviceTypesWidgetData['options']>
      form={form}
      layout="horizontal"
      name="eventStatusByDeviceTypesOptionsForm"
      autoComplete="off"
      initialValues={data.options}
      onValuesChange={onValuesChange}
    >
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.updateInterval.label}
        name="updateInterval"
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.updateInterval.options}
        />
      </WidgetFormItem>
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.deviceTypes.label}
        name="deviceTypes"
      >
        <CustomTreeSelect
          isLoadingUpdate={isLoadingUpdate}
          treeData={treeData}
          onDropdownVisibleChange={onDeviceTypesDropdownVisibleChange}
        />
      </WidgetFormItem>
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.eventTypes.label}
        name="eventTypes"
      >
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

export default EventStatusByDeviceTypesOptions;

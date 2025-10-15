import { useCallback } from 'react';
import { App, Form, Select } from 'antd';
import CustomTreeSelect from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import useDeviceTypesField from '@/hooks/useDeviceTypesField';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { NumOfEventsWidgetData } from '@/types/api/dashboard';
import { ChartType } from '@/types/enum';
import { WIDGET_SELECT_OPTIONS } from '@/config';

const filteredWidgetTypeOptions =
  WIDGET_SELECT_OPTIONS.chartType.options.filter(option => {
    if (option.value === ChartType.Line) return false;
    return true;
  });

interface Props {
  id: string;
  data: NumOfEventsWidgetData;
}

const NumOfEventsOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<NumOfEventsWidgetData['options']>();
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

  if (errorUpdate) {
    message.error(`[${data.title}] 위젯 설정 변경에 실패했습니다.`);
    console.error(
      `[${data.title}] 위젯 설정 변경에 실패했습니다.`,
      errorUpdate,
    );
  }

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류는 드랍다운 닫힐 때만 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<NumOfEventsWidgetData['options']>,
      allValues: NumOfEventsWidgetData['options'],
    ) => {
      const { deviceTypes } = changedValues;

      if (deviceTypes) {
        onDeviceTypesValuesChange(deviceTypes);
        return;
      }

      updateWidgetOptions({ id, options: allValues });
    },
    [id, updateWidgetOptions, onDeviceTypesValuesChange],
  );

  return (
    <Form<NumOfEventsWidgetData['options']>
      form={form}
      layout="horizontal"
      name="numOfEventsOptionsForm"
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
        label={WIDGET_SELECT_OPTIONS.chartType.label}
        name="chartType"
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={filteredWidgetTypeOptions}
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
    </Form>
  );
};

export default NumOfEventsOptions;

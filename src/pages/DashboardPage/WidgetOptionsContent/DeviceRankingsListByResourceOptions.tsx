import { useCallback } from 'react';
import { App, Form, Select } from 'antd';
import CustomTreeSelect from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import useDeviceTypesField from '@/hooks/useDeviceTypesField';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { DeviceRankingsListByResourceWidgetData } from '@/types/api/dashboard';
import { WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: DeviceRankingsListByResourceWidgetData;
}

const DeviceRankingsListByResourceOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] =
    Form.useForm<DeviceRankingsListByResourceWidgetData['options']>();
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

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류와 장애종류는 드랍다운 닫힐 때만 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<DeviceRankingsListByResourceWidgetData['options']>,
      allValues: DeviceRankingsListByResourceWidgetData['options'],
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
    <Form<DeviceRankingsListByResourceWidgetData['options']>
      form={form}
      layout="horizontal"
      name="deviceRankingsListByResourceOptionsForm"
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
        label={WIDGET_SELECT_OPTIONS.rankCount.label}
        name="rankCount"
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.rankCount.options}
        />
      </WidgetFormItem>
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.selectedResource.label}
        name="selectedResource"
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.selectedResource.options}
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

export default DeviceRankingsListByResourceOptions;

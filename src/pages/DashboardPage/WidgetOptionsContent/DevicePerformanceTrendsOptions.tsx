import { useCallback } from 'react';
import { App, Form, Select } from 'antd';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import {
  useGetDeviceListByDeviceTypeQuery,
  useUpdateWidgetOptionsMutation,
} from '@/services/api/dashboard';
import { DevicePerformanceTrendsWidgetData } from '@/types/api/dashboard';
import { WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: DevicePerformanceTrendsWidgetData;
}

interface FormValues {
  updateInterval: number;
  selectedDevice: number;
}

const DevicePerformanceTrendsOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const { data: deviceList, isLoading: isLoadingDeviceList } =
    useGetDeviceListByDeviceTypeQuery(1);
  const [
    updateWidgetOptions,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateWidgetOptionsMutation();

  if (errorUpdate) {
    message.error(`[${data.title}] 위젯 설정 변경에 실패했습니다.`);
    console.error(
      `[${data.title}] 위젯 설정 변경에 실패했습니다.`,
      errorUpdate,
    );
  }
  const onValuesChange = useCallback(
    async (changedValues: Partial<FormValues>, allValues: FormValues) => {
      updateWidgetOptions({
        id,
        options: {
          updateInterval: allValues.updateInterval,
          selectedDevice: allValues.selectedDevice,
        },
      });
    },
    [id, updateWidgetOptions],
  );

  const deviceListOptions =
    deviceList?.map(device => ({
      label: device.deviceNm,
      value: device.deviceKey,
    })) || [];

  return (
    <Form<FormValues>
      form={form}
      layout="horizontal"
      name="devicePerformanceTrendsOptionsForm"
      autoComplete="off"
      initialValues={{
        updateInterval: data.options.updateInterval,
        selectedDevice: data.options.selectedDevice,
      }}
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
      <WidgetFormItem label="선택장비" name="selectedDevice">
        <Select
          loading={isLoadingDeviceList}
          disabled={isLoadingDeviceList}
          options={deviceListOptions}
        />
      </WidgetFormItem>
    </Form>
  );
};

export default DevicePerformanceTrendsOptions;

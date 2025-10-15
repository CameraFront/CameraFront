import { useCallback } from 'react';
import { App, Form, Input, Select } from 'antd';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { MapViewWidgetData } from '@/types/api/dashboard';
import { DEFAULT_MAP_VIEW_KEY } from '@/config/constants';
import { WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: MapViewWidgetData;
}

const MapViewOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<MapViewWidgetData['options']>();
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

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<MapViewWidgetData['options']>,
      allValues: MapViewWidgetData['options'],
    ) => {
      updateWidgetOptions({
        id,
        options: { ...allValues, selectedMap: DEFAULT_MAP_VIEW_KEY },
      });
    },
    [id, updateWidgetOptions],
  );

  return (
    <Form<MapViewWidgetData['options']>
      form={form}
      layout="horizontal"
      name="mapViewOptionsForm"
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
    </Form>
  );
};

export default MapViewOptions;

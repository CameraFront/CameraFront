import { useCallback } from 'react';
import { App, Form, Select } from 'antd';
import CustomTreeSelect, {
  tagRender,
} from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import useDeviceTypesField from '@/hooks/useDeviceTypesField';
import useEventTypesField from '@/hooks/useEventTypesField';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { StationRankingsByEventWidgetData } from '@/types/api/dashboard';
import { ChartType } from '@/types/enum';
import { WIDGET_SELECT_OPTIONS } from '@/config';

const filteredWidgetTypeOptions =
  WIDGET_SELECT_OPTIONS.chartType.options.filter(option => {
    if (option.value === ChartType.Line) return false;
    return true;
  });

interface Props {
  id: string;
  data: StationRankingsByEventWidgetData;
}

const StationRankingsByEventOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<StationRankingsByEventWidgetData['options']>();
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
      `[${data.title}] 위젯 설정 변경에 실패했습니다.`,
      errorUpdate,
    );
  }

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류와 장애종류는 드랍다운 닫힐 때만 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<StationRankingsByEventWidgetData['options']>,
      allValues: StationRankingsByEventWidgetData['options'],
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
    <Form<StationRankingsByEventWidgetData['options']>
      form={form}
      layout="horizontal"
      name="stationRankingsByEventOptionsForm"
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

export default StationRankingsByEventOptions;

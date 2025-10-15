import { useCallback } from 'react';
import { App, Form, Select, SelectProps } from 'antd';
import { tagRender } from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { CallPeakTrendsWidgetData } from '@/types/api/dashboard';
import { ChartType } from '@/types/enum';
import { ALL_ITEMS_SELECTED, WIDGET_SELECT_OPTIONS } from '@/config';

const filteredWidgetTypeOptions =
  WIDGET_SELECT_OPTIONS.chartType.options.filter(option => {
    if (
      option.value === ChartType.Pie ||
      option.value === ChartType.HorizontalBar
    )
      return false;
    return true;
  });

interface Props {
  id: string;
  data: CallPeakTrendsWidgetData;
}

const CallPeakTrendsOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<CallPeakTrendsWidgetData['options']>();
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

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류와 장애종류는 드랍다운 닫힐 때만 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<CallPeakTrendsWidgetData['options']>,
      allValues: CallPeakTrendsWidgetData['options'],
    ) => {
      const { callPeakTypes } = changedValues;
      if (callPeakTypes) {
        if (callPeakTypes.length === 0) {
          message.warning('통화 종류를 하나 이상 선택해야 합니다.');
          form.setFieldValue('callPeakTypes', ALL_ITEMS_SELECTED.slice());
          // eslint-disable-next-line no-useless-return
          return;
        }
        form.setFieldValue('callPeakTypes', callPeakTypes.slice().sort());
        return;
      }

      updateWidgetOptions({ id, options: allValues });
    },
    [form, id, updateWidgetOptions, message],
  );

  const onCallPeakTypesDropdownVisibleChange = useCallback<
    NonNullable<SelectProps['onDropdownVisibleChange']>
  >(
    visible => {
      if (visible) return;

      const newOptions = form.getFieldsValue();
      const { callPeakTypes } = newOptions;

      // 통화종류가 변경되지 않았다면 업데이트 요청 중지
      if (
        JSON.stringify(callPeakTypes) ===
        JSON.stringify(data.options.callPeakTypes)
      )
        return;

      updateWidgetOptions({ id, options: newOptions });
    },
    [form, id, updateWidgetOptions, data.options.callPeakTypes],
  );

  return (
    <Form<CallPeakTrendsWidgetData['options']>
      form={form}
      layout="horizontal"
      name="callPeakTrendsOptionsForm"
      autoComplete="off"
      initialValues={data.options}
      onValuesChange={onValuesChange}
    >
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.updateIntervalShort.label}
        name="updateInterval"
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.updateIntervalShort.options}
        />
      </WidgetFormItem>

      {/* <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.chartType.label}
        name="chartType"
      >
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={filteredWidgetTypeOptions}
        />
      </WidgetFormItem> */}
      <WidgetFormItem
        label={WIDGET_SELECT_OPTIONS.callPeakTypes.label}
        name="callPeakTypes"
      >
        <Select
          mode="multiple"
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={WIDGET_SELECT_OPTIONS.callPeakTypes.options}
          onDropdownVisibleChange={onCallPeakTypesDropdownVisibleChange}
          tagRender={tagRender}
        />
      </WidgetFormItem>
    </Form>
  );
};

export default CallPeakTrendsOptions;

import { useCallback } from 'react';
import { App, Form, Select } from 'antd';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { HrInfoUpdateTimeWidgetData } from '@/types/api/dashboard';
import { WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: HrInfoUpdateTimeWidgetData;
}

const HrInfoUpdateTimeOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<HrInfoUpdateTimeWidgetData['options']>();
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
      changedValues: Partial<HrInfoUpdateTimeWidgetData['options']>,
      allValues: HrInfoUpdateTimeWidgetData['options'],
    ) => {
      updateWidgetOptions({ id, options: allValues });
    },
    [id, updateWidgetOptions],
  );

  return (
    <Form<HrInfoUpdateTimeWidgetData['options']>
      form={form}
      layout="horizontal"
      name="hrInfoUpdateTimeOptionsForm"
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

export default HrInfoUpdateTimeOptions;

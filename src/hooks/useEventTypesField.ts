import { useCallback } from 'react';
import { App, FormInstance, TreeSelectProps } from 'antd';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { LayoutItem } from '@/types/api/dashboard';
import { ALL_EVENT_TYPES_SELECTED } from '@/config';

interface Props {
  form: FormInstance;
  id: string;
  data: LayoutItem['data'];
}

const useEventTypesField = ({ form, id, data }: Props) => {
  const { message } = App.useApp();
  const [updateWidgetOptions] = useUpdateWidgetOptionsMutation();

  const onEventTypesValuesChange = useCallback(
    (eventTypes: number[]) => {
      if (eventTypes.length === 0) {
        message.warning('장애종류를 하나 이상 선택해야 합니다.');
        form.setFieldValue('eventTypes', ALL_EVENT_TYPES_SELECTED.slice());
        // eslint-disable-next-line no-useless-return
        return;
      }
    },
    [form, message],
  );

  const onEventTypesDropdownVisibleChange = useCallback<
    NonNullable<TreeSelectProps['onDropdownVisibleChange']>
  >(
    visible => {
      if (visible) return;

      const newOptions = form.getFieldsValue();
      const { eventTypes } = newOptions;

      // 장애종류가 변경되지 않았다면 업데이트 요청 중지
      if (
        JSON.stringify(eventTypes) === JSON.stringify(data.options.eventTypes)
      )
        return;

      updateWidgetOptions({
        id,
        options: newOptions,
      });
    },
    [form, id, updateWidgetOptions, data.options.eventTypes],
  );

  return {
    onEventTypesDropdownVisibleChange,
    onEventTypesValuesChange,
  };
};

export default useEventTypesField;

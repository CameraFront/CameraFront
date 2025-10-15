import { useCallback, useMemo } from 'react';
import { App, Form, Select, SelectProps } from 'antd';
import { tagRender } from '@/components/form/CustomTreeSelect';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { useGetPhoneTypeListQuery } from '@/services/api/settings/phones';
import { UnregisteredPhoneListWidgetData } from '@/types/api/dashboard';
import { ALL_ITEMS_SELECTED, WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: UnregisteredPhoneListWidgetData;
}

const UnregisteredPhoneListOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<UnregisteredPhoneListWidgetData['options']>();
  const { data: phoneTypeList } = useGetPhoneTypeListQuery({
    hasPagination: false,
  });
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

  const phoneTypeOptions = useMemo(() => {
    if (!phoneTypeList) return [];
    const options = [
      {
        label: '전체',
        value: 0,
      },
    ];
    return options.concat(
      phoneTypeList.listPhoneType.map(item => ({
        label: item.phoneTypeNm,
        value: item.phoneType,
      })),
    );
  }, [phoneTypeList]);

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류와 장애종류는 드랍다운 닫힐 때만 업데이트 요청

  const onValuesChange = useCallback(
    (
      changedValues: Partial<UnregisteredPhoneListWidgetData['options']>,
      allValues: UnregisteredPhoneListWidgetData['options'],
    ) => {
      const { phoneTypes } = changedValues;
      if (phoneTypes) {
        if (phoneTypes.length === 0) {
          message.warning('전화기종류를 하나 이상 선택해야 합니다.');
          form.setFieldValue('phoneTypes', ALL_ITEMS_SELECTED.slice());
          return;
        }

        // 다른 장비종류들이 있는 상태에서 '전체'를 선택한 경우 '전체'만 선택
        if (phoneTypes[phoneTypes.length - 1] === 0) {
          form.setFieldValue('phoneTypes', ALL_ITEMS_SELECTED.slice());
          return;
        }

        // '전체'인데 다른 장비종류를 선택한 경우 '전체' 해제
        if (phoneTypes[0] === 0) {
          form.setFieldValue('phoneTypes', phoneTypes.slice(1));
          // eslint-disable-next-line no-useless-return

          return;
        }
        form.setFieldValue('phoneTypes', phoneTypes.slice().sort());
        return;
      }

      updateWidgetOptions({ id, options: allValues });
    },
    [form, id, updateWidgetOptions, message],
  );

  const onPhoneTypesDropdownVisibleChange = useCallback<
    NonNullable<SelectProps['onDropdownVisibleChange']>
  >(
    visible => {
      if (visible) return;

      const newOptions = form.getFieldsValue();
      const { phoneTypes } = newOptions;

      // 전화기종류가 변경되지 않았다면 업데이트 요청 중지
      if (
        JSON.stringify(phoneTypes) === JSON.stringify(data.options.phoneTypes)
      )
        return;

      updateWidgetOptions({ id, options: newOptions });
    },
    [form, id, updateWidgetOptions, data.options.phoneTypes],
  );

  return (
    <Form<UnregisteredPhoneListWidgetData['options']>
      form={form}
      layout="horizontal"
      name="unregisteredPhoneListOptionsForm"
      autoComplete="off"
      initialValues={data.options}
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
      <WidgetFormItem label="전화기종류" name="phoneTypes">
        <Select
          mode="multiple"
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={phoneTypeOptions}
          onDropdownVisibleChange={onPhoneTypesDropdownVisibleChange}
          tagRender={tagRender}
        />
      </WidgetFormItem>
    </Form>
  );
};

export default UnregisteredPhoneListOptions;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Form, Select } from 'antd';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import { useUpdateWidgetLayoutsMutation, useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { useGetPhoneTypeListQuery } from '@/services/api/settings/phones';
import { UnregisteredPhonesByTypeWidgetData } from '@/types/api/dashboard';
import { NONE_SELECTED, WIDGET_SELECT_OPTIONS } from '@/config';
import { useAppSelector } from '@/app/hooks';
import { createNextState } from '@reduxjs/toolkit';

interface Props {
  id: string;
  data: UnregisteredPhonesByTypeWidgetData;
}

const UnregisteredPhonesByTypeOptions = ({ id, data }: Props) => {
  const { layoutItems } = useAppSelector(store => store.dashboard);
  const { message } = App.useApp();
  const [form] = Form.useForm<UnregisteredPhonesByTypeWidgetData['options']>();
  const { data: phoneTypeList } = useGetPhoneTypeListQuery({
    hasPagination: false,
  });
  const [
    updateWidgetOptions,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateWidgetOptionsMutation();
  const [updateWidgetLayouts] = useUpdateWidgetLayoutsMutation();

  const [title, setTitle] = useState<string>(data.title);

  if (errorUpdate) {
    message.error(`[${data.title}] 위젯 설정 변경에 실패했습니다.`);
    console.error(
      `[${data.title}] 위젯 설정 변경에 실패했습니다.`,
      errorUpdate,
    );
  }


  const phoneTypeOptions = useMemo(() => {
    if (!phoneTypeList) return [];

    return phoneTypeList.listPhoneType.map(item => ({
      label: item.phoneTypeNm,
      value: item.phoneType,
    }));
  }, [phoneTypeList]);

  // 위젯옵션 값 변경시 위젯옵션 업데이트 요청. 단, 장비종류와 장애종류는 드랍다운 닫힐 때만 업데이트 요청
  const onValuesChange = useCallback(
    (
      changedValues: Partial<UnregisteredPhonesByTypeWidgetData['options']>,
      allValues: UnregisteredPhonesByTypeWidgetData['options'],
    ) => {
      const { phoneType } = allValues;
      if (!phoneType) {
        message.warning('전화기종류를 선택해야 합니다.');
        form.setFieldValue(
          'phoneType',
          phoneTypeList?.listPhoneType[0]?.phoneType,
        );
        return;
      }

      updateWidgetOptions({ id, options: allValues });
    },
    [id, form, message, phoneTypeList, updateWidgetOptions],
  );

  const onTitleUpdate = useCallback((value: number) => {
    const newTitle = phoneTypeList?.listPhoneType[value - 1]?.phoneTypeNm || '';
  
    const newLayoutItems = layoutItems.map(item => {
      if (item.i === id) {
        return createNextState(item, item => {
          item.data.title = newTitle;
        });
      }

      return item;
    });

    console.log("new", newLayoutItems)
    updateWidgetLayouts(newLayoutItems);
  }, [layoutItems, id, updateWidgetLayouts]);

  return (
    <Form<UnregisteredPhonesByTypeWidgetData['options']>
      form={form}
      layout="horizontal"
      name="unregisteredPhonesByTypeOptionsForm"
      autoComplete="off"
      initialValues={{
        ...data.options,
        phoneType:
          data.options.phoneType === NONE_SELECTED
            ? undefined
            : data.options.phoneType,
      }}
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
      <WidgetFormItem label="전화기종류" name="phoneType">
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={phoneTypeOptions}
          onChange={(value) => {
            onTitleUpdate(value)
          }}
        />
      </WidgetFormItem>
    </Form>
  );
};

export default UnregisteredPhonesByTypeOptions;

import { useCallback, useMemo } from 'react';
import { App, Form, Select } from 'antd';
import { WidgetFormItem } from '@/components/form/WidgetFormItem';
import { useGetParentBranchListQuery } from '@/services/api/common';
import { useUpdateWidgetOptionsMutation } from '@/services/api/dashboard';
import { useGetRackLayoutMapListQuery } from '@/services/api/rackLayout';
import { RackLayoutWidgetData } from '@/types/api/dashboard';
import { WIDGET_SELECT_OPTIONS } from '@/config';

interface Props {
  id: string;
  data: RackLayoutWidgetData;
}

const RackLayoutOptions = ({ id, data }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<RackLayoutWidgetData['options']>();
  const [
    updateWidgetOptions,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateWidgetOptionsMutation();
  const { data: parentBranchList } = useGetParentBranchListQuery();
  const { data: rackLayoutMapList } = useGetRackLayoutMapListQuery();

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
      changedValues: Partial<RackLayoutWidgetData['options']>,
      allValues: RackLayoutWidgetData['options'],
    ) => {
      updateWidgetOptions({ id, options: allValues });
    },
    [id, updateWidgetOptions],
  );

  const mapOptions = useMemo(() => {
    if (!parentBranchList || !rackLayoutMapList) return [];

    return rackLayoutMapList?.map(map => {
      const parentBranch = parentBranchList.find(
        branch => branch.managementCd === map.managementCd,
      );
      const parentIds = parentBranch?.path.split('/').slice(1).map(Number);
      const parentNames = parentIds?.map(parentId => {
        const parentBranch = parentBranchList.find(
          branch => branch.managementCd === parentId,
        );
        if (!parentBranch) return '';
        return parentBranch?.managementNm;
      });
      const label = `${map.rackNm}(${parentNames?.join('>')})`;

      return {
        label,
        value: map.seqNum,
      };
    });
  }, [rackLayoutMapList, parentBranchList]);

  return (
    <Form<RackLayoutWidgetData['options']>
      form={form}
      layout="horizontal"
      name="rackLayoutOptionsForm"
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
      <WidgetFormItem label="맵" name="selectedMap">
        <Select
          loading={isLoadingUpdate}
          disabled={isLoadingUpdate}
          options={mapOptions}
        />
      </WidgetFormItem>
    </Form>
  );
};

export default RackLayoutOptions;

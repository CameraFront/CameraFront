import { useEffect, useMemo, useState } from 'react';
import { App, Cascader, DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import useManagementOptions from '@/hooks/useManagementOptions';
import { useGetDeviceTypesByDepthQuery } from '@/services/api/common';
import { useGetDeviceManagerListAllQuery } from '@/services/api/settings/deviceManagers';
import { useGetManagementQuery } from '@/services/api/settings/managements';
import {
  useCreateTerminalMutation,
  useGetTerminalQuery,
  useLazyGetL2SwitchListQuery,
  useLazyGetPortKeyListQuery,
  useUpdateTerminalMutation,
} from '@/services/api/settings/terminals';
import { OptionType } from '@/types/api/common';
import { OpenedModalType, TerminalFormValues } from '@/types/api/settings';
import { TERMINAL_DEVICE_TYPE } from '@/config/constants';
import { getSuccessMessage } from '@/config/messages';
import { MANAGE_OPTIONS } from '@/config/options';

const initialValues = {
  managementCds: [],
  device1Depth: TERMINAL_DEVICE_TYPE,
  device2Depth: undefined,

  switchPortNm: '',
  pstnNm: '',
  deviceIp: '',
  installCompany: '',
  modelNm: '',
  productCompany: '',
  installDate: '',
  managerA: '',
  managerB: '',
  manageYn: '',
  switchIp: '',
  switchPortKey: '',
};
interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const isUpdate = useMemo(
    () => openedModalType === 'update',
    [openedModalType],
  );
  const isClone = useMemo(
    () => openedModalType === 'clone',
    [openedModalType],
  );
  const { message } = App.useApp();
  const [form] = Form.useForm<
    Omit<TerminalFormValues, 'managementCd'> & {
      managementCds: number[];
    }
  >();
  const { data: terminal, isLoading: isLoadingTerminal } = useGetTerminalQuery(
    id,
    {
      skip: !(isUpdate || isClone),
    },
  );
  const { data: managementDetails } = useGetManagementQuery(
    terminal?.managementCd,
    {
      skip: !(isUpdate || isClone) || !terminal?.managementCd,
    },
  );
  const parentNodes = useMemo<(number | null)[] | undefined>(() => {
    if (!isUpdate && !isClone) return [null];
    if (!managementDetails) return undefined;

    return [
      null,
      ...(managementDetails.path.split('/').slice(1, -1).map(Number) ?? []),
    ];
  }, [isUpdate, isClone, managementDetails]);
  const {
    options,
    loadOptions: loadManagementOptions,
    isLoading: isLoadingCascader,
    isInitialized,
  } = useManagementOptions({
    hasRoot: false,
    initialValues: parentNodes,
  });
  const { data: deviceTypes2 } = useGetDeviceTypesByDepthQuery({
    depth: 2,
    deviceType: TERMINAL_DEVICE_TYPE,
  });
  const { data: deviceManagers } = useGetDeviceManagerListAllQuery();
  const [getL2SwitchList, { isLoading: isLoadingL2SwitchList }] =
    useLazyGetL2SwitchListQuery();
  const [getPortKeyList, { isLoading: isLoadingPortKeyList }] =
    useLazyGetPortKeyListQuery();
  const [createTerminal, { isLoading: isCreating }] =
    useCreateTerminalMutation();
  const [updateTerminal, { isLoading: isUpdating }] =
    useUpdateTerminalMutation();
  const [switchIpOptions, setSwitchIpOptions] = useState<OptionType<string>[]>(
    [],
  );
  const [switchPortKeyOptions, setSwitchPortKeyOptions] = useState<
    OptionType<string>[]
  >([]);

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onValuesChange = (
    changedValues: Partial<
      Omit<TerminalFormValues, 'managementCd'> & {
        managementCds: number[];
      }
    >,
  ) => {
    if (changedValues.managementCds) {
      loadManagementOptions(changedValues.managementCds);
    }

    if ('switchIp' in changedValues) {
      if (!changedValues.switchIp) {
        setSwitchPortKeyOptions([]);
        return;
      }

      getPortKeyList(changedValues.switchIp).then(res => {
        if (res.data) {
          setSwitchPortKeyOptions(
            res.data.portKeyList.map(({ portKey }) => ({
              label: portKey,
              value: portKey,
            })),
          );
        }
      });
    }
  };

  const onCascaderBlur = () => {
    const managementCds = form.getFieldValue('managementCds');
    if (!managementCds || !managementCds.length) {
      setSwitchIpOptions([]);
      return;
    }
    const managementCd = managementCds[managementCds.length - 1];
    getL2SwitchList(managementCd).then(res => {
      if (res.data) {
        setSwitchIpOptions(
          res.data.l2List.map(({ switchIp, switchNm }) => ({
            label: `${switchIp} (${switchNm})`,
            value: switchIp,
          })),
        );
      }
    });
  };

  const onSubmit = async () => {
    const { managementCds, ...rest } = await form.validateFields();
    const deviceKindNm =
      deviceTypes2?.deviceDepthList.find(
        ({ deviceKind }) => deviceKind === rest.device2Depth,
      )?.deviceKindNm ?? '';
    if (isUpdate && id) {
      const result = await updateTerminal({
        ...rest,
        managementCd: managementCds[managementCds.length - 1],
        deviceKey: id,
        deviceKindNm,
      });
      if ('error' in result) return;

      message.success(getSuccessMessage('update', '단말기가'));
    } else if (isClone && id) {
      const result = await createTerminal({
        ...rest,
        managementCd: managementCds[managementCds.length - 1],
        deviceKindNm,
      });
      if ('error' in result) return;

      message.success(getSuccessMessage('clone', '단말기가'));
    } else {
      const result = await createTerminal({
        ...rest,
        managementCd: managementCds[managementCds.length - 1],
        deviceKindNm,
      });
      if ('error' in result) return;

      message.success(getSuccessMessage('create', '단말기가'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () => {
      if (isClone) {
        return '기존 단말기 복제하기';
      }
      return isUpdate ? '기존 단말기 수정하기' : '새 단말기 추가하기';
    },
    [isUpdate, isClone],
  );

  const deviceType1Options = useMemo(
    () => [{ label: '단말기', value: TERMINAL_DEVICE_TYPE }],
    [],
  );

  const deviceType2Options = useMemo(
    () =>
      deviceTypes2?.deviceDepthList.map(({ deviceKind, deviceKindNm }) => ({
        label: deviceKindNm,
        value: deviceKind,
      })) ?? [],
    [deviceTypes2],
  );

  const deviceManagerOptions = useMemo(
    () =>
      deviceManagers?.listEquipManager.map(({ seqNum, managerNm }) => ({
        label: managerNm,
        value: seqNum,
      })) ?? [],
    [deviceManagers],
  );

  const isLoading = isCreating || isUpdating || isLoadingTerminal;

  useEffect(() => {
    if (!isInitialized) return;

    if ((isUpdate && id && terminal && managementDetails) || (isClone && id && terminal && managementDetails)) {
      const managementCds = managementDetails.path
        .split('/')
        .slice(1)
        .map(Number);
      form.setFieldsValue({
        managementCds,
        device1Depth: terminal.device1Depth,
        device2Depth: terminal.device2Depth,
        switchPortNm: terminal.deviceNm,
        pstnNm: terminal.pstnNm,
        deviceIp: terminal.deviceIp,
        installCompany: terminal.installCompany,
        modelNm: terminal.modelNm,
        productCompany: terminal.productCompany,
        installDate: terminal.installDate
          ? dayjs(terminal.installDate)
          : undefined,
        managerA: terminal.managerA,
        managerB: terminal.managerB,
        manageYn: terminal.manageYn,
        switchIp: terminal.switchIp ?? undefined,
        switchPortKey: terminal.switchPortKey ?? undefined,
      });
    }
  }, [
    isUpdate,
    isClone,
    id,
    form,
    terminal,
    managementDetails,
    isInitialized,
    parentNodes,
  ]);

  return (
    <Wrapper
      centered
      destroyOnClose
      title={modalTitle}
      open={!!openedModalType}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={isLoading}
      okButtonProps={{ disabled: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      afterClose={afterCloseModal}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 6 }}
        name="terminals-form-in-modal"
        layout="horizontal"
        initialValues={initialValues}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="소속"
          name="managementCds"
          rules={[{ required: true, message: '소속을 선택하세요.' }]}
        >
          <Cascader
            changeOnSelect
            loading={isLoadingCascader}
            options={options}
            onBlur={onCascaderBlur}
          />
        </Form.Item>
        <Form.Item
          label="상위 장비종류"
          name="device1Depth"
          rules={[{ required: true, message: '상위 장비종류를 선택하세요.' }]}
        >
          <Select disabled options={deviceType1Options} />
        </Form.Item>
        <Form.Item
          label="하위 장비종류"
          name="device2Depth"
          rules={[{ required: true, message: '하위 장비종류를 선택하세요.' }]}
        >
          <Select options={deviceType2Options} />
        </Form.Item>
        <Form.Item
          label="단말기명"
          name="switchPortNm"
          rules={[{ required: true, message: '단말기명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="위치"
          name="pstnNm"
          rules={[{ required: true, message: '위치를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="IP주소"
          name="deviceIp"
          rules={[
            { required: true, message: 'IP주소를 입력하세요.' },
            {
              pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
              message: 'IP주소 형식이 올바르지 않습니다.',
            },
            {
              validator: (_, value: string) => {
                if (!value) return Promise.resolve();

                const parts = value.split('.');
                const isValid = parts.every(part => {
                  const num = parseInt(part, 10);
                  return num >= 0 && num <= 255;
                });

                return isValid
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error('IP주소는 0-255 사이의 숫자여야 합니다.'),
                    );
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="설치업체" name="installCompany">
          <Input />
        </Form.Item>
        <Form.Item label="모델명" name="modelNm">
          <Input />
        </Form.Item>
        <Form.Item label="제조사" name="productCompany">
          <Input />
        </Form.Item>
        <Form.Item label="설치일자" name="installDate">
          <DatePicker />
        </Form.Item>
        <Form.Item label="관리자(정)" name="managerA">
          <Select options={deviceManagerOptions} />
        </Form.Item>
        <Form.Item label="관리자(부)" name="managerB">
          <Select options={deviceManagerOptions} />
        </Form.Item>
        <Form.Item
          label="관리여부"
          name="manageYn"
          hidden={!isUpdate}
          rules={[{ required: isUpdate, message: '관리여부를 선택하세요.' }]}
        >
          <Select options={MANAGE_OPTIONS} />
        </Form.Item>
        <Form.Item label="스위치 IP" name="switchIp">
          <Select
            allowClear
            loading={isLoadingL2SwitchList}
            options={switchIpOptions}
          />
        </Form.Item>
        <Form.Item label="스위치 포트번호" name="switchPortKey">
          <Select
            allowClear
            loading={isLoadingPortKeyList}
            options={switchPortKeyOptions}
          />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Modal)`
  .ant-modal-body {
    padding-top: 1.6rem;
    overflow-y: auto;
    max-height: 80vh;
    padding-right: 1.6rem;
  }
`;

export default FormModal;

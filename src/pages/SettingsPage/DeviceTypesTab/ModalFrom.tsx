import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  getDeviceType,
  getDeviceTypeCategories,
  getDeviceTypes,
  updateDeviceType,
} from '@/features/settingsPage/settingsSliceThunks';
import { Form, Input, Modal, Select } from 'antd';
import { Key, useEffect, useMemo } from 'react';
import styled from 'styled-components';

interface Props {
  isOpen: boolean;
  id: Key | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRow: React.Dispatch<React.SetStateAction<Key[]>>;
}

const ModalForm = ({ isOpen, id, setIsOpen, setSelectedRow }: Props) => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    deviceTypesTab: { deviceType, lv1Categories },
  } = useAppSelector(store => store.settings);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isOpen || !id) return;

    dispatch(getDeviceType(id));
    dispatch(getDeviceTypeCategories({ level: 1 }));
  }, [isOpen, id]);

  useEffect(() => {
    if (!isOpen || !id || !deviceType) return;

    form.setFieldsValue(deviceType);
  }, [isOpen, id, deviceType]);

  const lv1CategoriesOptions = useMemo(() => {
    if (!lv1Categories) return [];

    return lv1Categories.map(category => {
      return {
        label: category.deviceKindNm,
        value: category.deviceKind,
      };
    });
  }, [lv1Categories]);

  return (
    <Wrapper
      centered
      destroyOnClose
      title={id ? '기존 장비종류 수정하기' : '새 장비종류 추가하기'}
      open={isOpen}
      okText="저장"
      cancelText="취소"
      onCancel={() => {
        setIsOpen(false);
        form.resetFields();
      }}
      onOk={async () => {
        try {
          const values = await form.validateFields();

          if (id) {
            await dispatch(updateDeviceType(values));
          } else {
            // await dispatch(createBusinessUnit(values));
          }

          await dispatch(getDeviceTypes());
          setSelectedRow([]);
          setIsOpen(false);
        } catch (error) {
          console.log(error);
        }
      }}
      styles={{
        body: {
          paddingTop: '1.6rem',
          overflowY: 'auto',
          maxHeight: '80vh',
          paddingRight: '1.6rem',
        },
      }}
      confirmLoading={isLoading}
      okButtonProps={{ disabled: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 4 }}
        // wrapperCol={{ span: 20 }}
        name="form-in-modal"
        layout="horizontal"
      >
        {id ? (
          <Form.Item
            label="아이디"
            name="id"
            // rules={[{ required: true, message: '아이디가 없습니다.' }]}
          >
            <Input disabled />
          </Form.Item>
        ) : null}
        <Form.Item
          label="대분류"
          name="depth1Cd"
          rules={[{ required: true, message: '대분류를 선택하세요.' }]}
        >
          <Select options={lv1CategoriesOptions} />
        </Form.Item>
        <Form.Item
          label="장비종류"
          name="depth2Nm"
          rules={[{ required: true, message: '소분류을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Modal)``;

export default ModalForm;

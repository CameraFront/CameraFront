import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { signin } from '@/features/global/globalSlice';
import { Button, Form, Input } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SigninForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(store => store.global);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  return (
    <Form
      name="basic"
      labelCol={{
        span: 7,
      }}
      wrapperCol={{
        span: 12,
      }}
      onFinish={values => dispatch(signin(values))}
      autoComplete="on"
    >
      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
        
        name="userid"
        rules={[
          {
            required: true,
            message: '아이디를 입력하세요.',
          },
        ]}
      >
        <Input ref={inputRef} placeholder="아이디를 입력하세요." />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
        name="password"
        rules={[
          {
            required: true,
            message: '비밀번호를 입력하세요.',
          },
        ]}
      >
        <Input.Password placeholder="비밀번호를 입력하세요."/>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          block={true}
          loading={isLoading}
        >
          로그인
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SigninForm;

import { useEffect } from 'react';
import { App, Button, Flex, Form, Input } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import {
  useGetEventCommentByIdQuery,
  useUpdateEventCommentMutation,
} from '@/services/api/events';

interface Props {
  eventKey: number;
  onPopoverClose: () => void;
}

const CommentForm = ({ eventKey, onPopoverClose }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<{ comment: string | null }>();
  const {
    data: commentInfo,
    isLoading: isLoadingCommentInfo,
    isError: isErrorCommentInfo,
  } = useGetEventCommentByIdQuery(eventKey);
  const [updateEventComment, { isLoading: isLoadingUpdateEventComment }] =
    useUpdateEventCommentMutation();

  const onFinish = async () => {
    const values = await form.validateFields();
    await updateEventComment({ eventKey, comment: values.comment }).unwrap();
    onPopoverClose();
    await message.success('성공적으로 장애 코멘트가 저장되었습니다.');
  };

  const onCancel = () => {
    form.resetFields();
    onPopoverClose();
  };

  useEffect(() => {
    if (isErrorCommentInfo) {
      onPopoverClose();
    }
  }, [isErrorCommentInfo, onPopoverClose]);

  return (
    <Wrapper
      form={form}
      preserve={false}
      name="comment-form"
      layout="vertical"
      initialValues={{
        comment: commentInfo?.comment,
      }}
      onFinish={onFinish}
      suppressContentEditableWarning
    >
      <div className="comment-header">
        <div className="item">
          <span className="label">장비명:</span>
          <span className="content">{commentInfo?.deviceNm}</span>
        </div>
        <div className="item">
          <span className="label">장애 내용:</span>
          <span className="content">{commentInfo?.eventMsg}</span>
        </div>
      </div>
      <Form.Item
        name="comment"
        style={{ marginBottom: 16 }}
        rules={[{ required: true, message: '코멘트를 입력하세요.' }]}
      >
        <Input.TextArea rows={4} placeholder="입력된 코멘트가 없습니다." />
      </Form.Item>
      <Flex justify="flex-end" gap={8}>
        <Button loading={isLoadingUpdateEventComment} onClick={onCancel}>
          취소
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoadingCommentInfo || isLoadingUpdateEventComment}
        >
          저장
        </Button>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled(Form)`
  width: 44rem;
  padding: 8px;

  .comment-header {
    margin-bottom: 16px;

    .item {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;

      .label {
        color: ${themeGet('colors.textSub')};
      }
    }
  }
`;

export default CommentForm;

import useBeforeUpload from '@/hooks/useBeforeUpload';
import { FileConstraints } from '@/types/common';
import { InboxOutlined } from '@ant-design/icons';
import { Divider, Form, Upload, theme } from 'antd';
import { useTheme } from 'styled-components';

interface Props {
  label?: string;
  name: string;
  constraints: FileConstraints;
  required?: boolean;
}

const FileUploadField = ({
  label,
  name,
  constraints,
  required = false,
}: Props) => {
  const theme = useTheme();
  const { normFile, handleBeforeUpload } = useBeforeUpload(constraints);

  return (
    <Form.Item
      label={label}
      name={name}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      required={required}
      rules={[
        {
          required,
          message: `${label || '파일'}을 등록하세요.`,
        },
      ]}
    >
      <Upload.Dragger
        accept={constraints.extensions.map(ext => `.${ext}`).join(', ')}
        showUploadList={{ showPreviewIcon: false }}
        maxCount={1}
        beforeUpload={handleBeforeUpload}
        multiple={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          업로드할 파일을 Drag & Drop 하거나 영역을 클릭하여 등록하세요.
        </p>
        <div
          className="ant-upload-hint"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.colors.textSub,
          }}
        >
          <div>
            파일형식:
            <strong>
              {constraints.extensions.map(ext => ext.toUpperCase()).join(', ')}
            </strong>
          </div>
          {constraints.dimension && (
            <>
              <Divider type="vertical" />
              <div>
                허용 사이즈:
                <strong>{`${constraints.dimension.width}px * ${constraints.dimension.height}px`}</strong>
              </div>
            </>
          )}
          <Divider type="vertical" />
          <div>
            최대 파일크기: <strong>{constraints.size}MB</strong>
          </div>
        </div>
      </Upload.Dragger>
    </Form.Item>
  );
};

export default FileUploadField;

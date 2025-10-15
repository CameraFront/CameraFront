import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { App, Button, Divider, Form, Image, Input, Modal, Space } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  downloadReport,
  getReportAsHtml,
} from '@/features/reports/infrastructureReportPage/infrastructureReportSlice';
import {
  ReportFileName,
  ReportFileType,
  ReportFormValues,
  ReportType,
} from '@/features/reports/infrastructureReportPage/types';
import { intIdSchema } from '@/services/validation/common';
import statusReport from '@/assets/images/1.구축설비보고서_설비현황_구축설비현황보고서.png';
import detailsReport from '@/assets/images/2.구축설비보고서_설비현황_구축설비상세보고서.png';

const FacilityStatusTab = () => {
  const dispatch = useAppDispatch();
  const { reportInHtml } = useAppSelector(state => state.infrastructureReport);
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [fileType, setFileType] = useState<ReportFileType>('html');
  const [fileName, setFileName] =
    useState<ReportFileName>('구축설비_현황_보고서');
  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = useCallback(
    async (values: ReportFormValues) => {
      if (!fileType || !branchId) return;

      if (fileType === 'html') {
        await dispatch(
          getReportAsHtml({
            ...values,
            fileType,
            fileName,
            stationId: branchId,
            reportType: ReportType.구축설비,
          }),
        )
          .unwrap()
          .then(data => {
            setModalOpen(true);
          });
      } else if (fileType === 'pdf' || fileType === 'excel') {
        dispatch(
          downloadReport({
            ...values,
            fileType,
            fileName,
            stationId: branchId,
            reportType: ReportType.구축설비,
          }),
        );
      }
    },
    [dispatch, fileName, fileType, branchId],
  );

  const triggerSubmit = useCallback(
    (fileName: ReportFileName, fileType: ReportFileType) => {
      if (!branchId) {
        message.warning('트리에서 말단 노드를 선택하세요.');
        return;
      }

      setFileName(fileName);
      setFileType(fileType);
      form.submit();
    },
    [branchId, form, message],
  );

  return (
    <Wrapper>
      <Form<ReportFormValues>
        form={form}
        name="facility-status-form"
        layout="horizontal"
        onFinish={onSubmit}
      >
        <Space size="large">
          <Form.Item
            label="소속"
            name="department"
            rules={[{ required: true, message: '소속부서를 입력하세요' }]}
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="보고자"
            name="reporter"
            rules={[{ required: true, message: '보고자를 입력하세요' }]}
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="보고목적"
            name="purpose"
            rules={[{ required: true, message: '보고목적를 입력하세요' }]}
            required
          >
            <Input />
          </Form.Item>
        </Space>
        <div className="cards">
          <div className="card">
            <div className="preview-image">
              <Image src={statusReport} height="100%" />
            </div>
            <div className="action-container">
              <div className="title">구축설비 현황 보고서</div>
              <div className="query-group">
                <Button
                  block
                  onClick={() => {
                    triggerSubmit('구축설비_현황_보고서', 'html');
                  }}
                >
                  조회
                </Button>
              </div>
              <div className="divider-wrapper" style={{ padding: '0 24px' }}>
                <Divider style={{ margin: '16px 0' }} />
              </div>
              <div className="save-group">
                <Button
                  block
                  onClick={() => {
                    triggerSubmit('구축설비_현황_보고서', 'pdf');
                  }}
                >
                  PDF로 저장
                </Button>
                <Button
                  block
                  onClick={() => {
                    triggerSubmit('구축설비_현황_보고서', 'excel');
                  }}
                >
                  엑셀로 저장
                </Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="preview-image">
              <Image src={detailsReport} height="100%" />
            </div>
            <div className="action-container">
              <div className="title">구축설비 상세 보고서</div>
              <div className="query-group">
                <Button
                  block
                  onClick={() => {
                    triggerSubmit('구축설비_상세_보고서', 'html');
                  }}
                >
                  조회
                </Button>
              </div>
              <div className="divider-wrapper" style={{ padding: '0 24px' }}>
                <Divider style={{ margin: '16px 0' }} />
              </div>
              <div className="save-group">
                <Button
                  block
                  onClick={() => {
                    triggerSubmit('구축설비_상세_보고서', 'pdf');
                  }}
                >
                  PDF로 저장
                </Button>
                <Button
                  block
                  onClick={() => {
                    triggerSubmit('구축설비_상세_보고서', 'excel');
                  }}
                >
                  엑셀로 저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <Modal
        centered
        closeIcon={false}
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        width="min-content"
        footer={null}
        styles={{
          body: {
            overflowY: 'auto',
            maxHeight: '90vh',
            paddingRight: '8px',
          },
        }}
      >
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: reportInHtml }} />
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;

    .card {
      flex: 1;
      display: flex;

      background-color: ${themeGet('colors.bgBody')};
      border-radius: ${themeGet('borderRadius.normal')};
      height: 32rem;

      .preview-image {
        flex: 1;
        display: flex;
        justify-content: center;
        height: 100%;
      }

      .action-container {
        flex: 1;
        display: flex;
        flex-direction: column;

        padding: 2.4rem;

        .title {
          font-size: ${themeGet('fontSizes.s5')};
          font-weight: ${themeGet('fontWeights.medium')};
          margin-bottom: 2.4rem;
          text-align: center;
        }

        .query-group,
        .save-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          width: 100%;
        }
      }
    }
  }
`;

export default FacilityStatusTab;

import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  App,
  Button,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
} from 'antd';
import dayjs from 'dayjs';
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
import statisticsReport from '@/assets/images/3.구축설비보고서_장애통계_장애통계보고서.png';
import trendsReport from '@/assets/images/4.구축설비보고서_장애통계_장애발생추이보고서.png';

const options: { label: string; value: ReportFileName }[] = [
  { label: '장애 상세 보고서(실시간)', value: '장애_상세_보고서(실시간)' },
  { label: '장애 상세 보고서(이력)', value: '장애_상세_보고서(장애_이력)' },
  { label: '장애 통계 보고서', value: '장애_통계_보고서' },
];

const EventStatisticsTab = () => {
  const dispatch = useAppDispatch();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const { reportInHtml } = useAppSelector(state => state.infrastructureReport);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [fileType, setFileType] = useState<ReportFileType>('html');
  const [eventStatsType, setEventStatsType] = useState(options[0].value);
  const [fileName, setFileName] = useState<ReportFileName>('장애_통계_보고서');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateRangeStatistics, setSelectedDateRangeStatistics] =
    useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedDateTrends, setSelectedDateTrends] =
    useState<dayjs.Dayjs | null>(null);

  const onSubmit = useCallback(
    async (
      values: Pick<ReportFormValues, 'department' | 'reporter' | 'purpose'>,
    ) => {
      if (!fileType || !branchId) return;

      const selectedDate =
        fileName === '장애_발생추이_보고서' ? selectedDateTrends : null;
      const selectedRange =
        fileName === '장애_발생추이_보고서'
          ? null
          : selectedDateRangeStatistics!;

      if (fileType === 'html') {
        await dispatch(
          getReportAsHtml({
            ...values,
            fileType,
            fileName,
            stationId: branchId,
            reportType: ReportType.구축설비,
            ...(selectedDate && { selectedDate }),
            ...(selectedRange && { selectedRange }),
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
            ...(selectedDate && { selectedDate }),
            ...(selectedRange && { selectedRange }),
          }),
        );
      }
    },
    [
      dispatch,
      fileName,
      fileType,
      branchId,
      selectedDateRangeStatistics,
      selectedDateTrends,
    ],
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
      <Form
        form={form}
        name="event-statistics-form"
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
            rules={[{ required: true, message: '보고지를 입력하세요' }]}
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
              <Image src={statisticsReport} height="100%" />
            </div>
            <div className="action-container">
              <div className="title">장애 통계 보고서</div>
              <div className="query-group">
                <Select
                  placeholder="장애종류"
                  options={options}
                  value={eventStatsType}
                  onChange={(value: ReportFileName) => {
                    setEventStatsType(value);
                    setFileName(value);
                  }}
                />
                <DatePicker.RangePicker
                  value={selectedDateRangeStatistics}
                  onChange={dates => {
                    if (dates && dates[0] && dates[1]) {
                      setSelectedDateRangeStatistics([
                        dates[0] as dayjs.Dayjs,
                        dates[1] as dayjs.Dayjs,
                      ]);
                    } else {
                      setSelectedDateRangeStatistics(null);
                    }
                  }}
                />
                <Button
                  block
                  onClick={() => {
                    if (!selectedDateRangeStatistics) {
                      message.warning('조회할 기간을 선택해주세요');
                      return;
                    }

                    triggerSubmit(fileName, 'html');
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
                    if (!selectedDateRangeStatistics) {
                      message.warning('조회할 기간을 선택해주세요');
                      return;
                    }

                    triggerSubmit(fileName, 'pdf');
                  }}
                >
                  PDF로 저장
                </Button>
                <Button
                  block
                  onClick={() => {
                    if (!selectedDateRangeStatistics) {
                      message.warning('조회할 기간을 선택해주세요');
                      return;
                    }

                    triggerSubmit(fileName, 'excel');
                  }}
                >
                  엑셀로 저장
                </Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="preview-image">
              <Image src={trendsReport} height="100%" />
            </div>
            <div className="action-container">
              <div className="title">장애 발생추이 보고서</div>
              <div className="query-group">
                <DatePicker
                  value={selectedDateTrends}
                  onChange={date => {
                    if (date) {
                      setSelectedDateTrends(date);
                    } else {
                      setSelectedDateTrends(null);
                    }
                  }}
                />
                <Button
                  block
                  onClick={() => {
                    if (!selectedDateTrends) {
                      message.warning('조회할 일자를 선택해주세요');
                      return;
                    }

                    triggerSubmit('장애_발생추이_보고서', 'html');
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
                    if (!selectedDateTrends) {
                      message.warning('조회할 일자를 선택해주세요');
                      return;
                    }

                    triggerSubmit('장애_발생추이_보고서', 'pdf');
                  }}
                >
                  PDF로 저장
                </Button>
                <Button
                  block
                  onClick={() => {
                    if (!selectedDateTrends) {
                      message.warning('조회할 일자를 선택해주세요');
                      return;
                    }

                    triggerSubmit('장애_발생추이_보고서', 'excel');
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

export default EventStatisticsTab;

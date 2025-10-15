import { useCallback, useEffect, useState } from 'react';
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
import axios from 'axios';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  downloadReport,
  getReportAsHtml,
} from '@/features/reports/infrastructureReportPage/infrastructureReportSlice';
import { REPORT_BASE_URL } from '@/features/reports/infrastructureReportPage/infrastructureReportSliceThunk';
import {
  ReportFileName,
  ReportFileType,
  ReportFormValues,
  ReportType,
} from '@/features/reports/infrastructureReportPage/types';
import { intIdSchema } from '@/services/validation/common';
import statisticsReport from '@/assets/images/5.구축설비보고서_성능통계_구축설비성능보고서.png';

interface OptionType {
  label: string;
  value: string | number;
}

const options: OptionType[] = [
  {
    label: 'CPU',
    value: 'cpu',
  },
  {
    label: '메모리',
    value: 'memory',
  },
  {
    label: '파일시스템',
    value: 'fileSystem',
  },
  {
    label: '네트워크',
    value: 'network',
  },
  // {
  //   label: 'GPU',
  //   value: 'gpu',
  // },
];

const PerformanceStatisticsTab = () => {
  const dispatch = useAppDispatch();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const { reportInHtml } = useAppSelector(state => state.infrastructureReport);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [fileType, setFileType] = useState<ReportFileType>('html');
  const [fileName, setFileName] =
    useState<ReportFileName>('구축설비_현황_보고서');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerformanceType, setSelectedPerformanceType] =
    useState<OptionType | null>(null);
  const [deviceOptions, setDeviceOptions] = useState<OptionType[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null);

  const onSubmit = useCallback(
    async (values: ReportFormValues) => {
      if (!fileType || !branchId || !selectedDevice) return;

      if (fileType === 'html') {
        await dispatch(
          getReportAsHtml({
            ...values,
            fileType,
            fileName,
            stationId: branchId,
            reportType: ReportType.구축설비,
            selectedRange: selectedDateRange!,
            selectedDevice,
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
            selectedRange: selectedDateRange!,
            selectedDevice,
          }),
        );
      }
    },
    [dispatch, fileName, fileType, branchId, selectedDateRange, selectedDevice],
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

  useEffect(() => {
    if (!selectedPerformanceType) return;
    if (!branchId) {
      message.warning('트리에서 말단 노드를 선택하세요.');
      return;
    }

    const getDeviceList = async (stationId: string, deviceType: string) => {
      try {
        const { data } = await axios.post<{ DNAME: string; DKEY: number }[]>(
          `report/list/${stationId}/${deviceType}`,
          {},
          {
            baseURL: REPORT_BASE_URL,
          },
        );

        setDeviceOptions(
          data.map(item => ({
            label: item.DNAME,
            value: item.DKEY,
          })),
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data.message);
        }
        console.error(error);
      }
    };

    setSelectedDevice(null);
    getDeviceList(branchId, selectedPerformanceType.value as string);
  }, [branchId, message, selectedPerformanceType]);

  return (
    <Wrapper>
      <Form
        form={form}
        name="performance-statistics-form"
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
              <div className="title">구축설비 성능 보고서</div>
              <div className="query-group">
                <Select
                  labelInValue
                  placeholder="성능 종류"
                  options={options}
                  value={selectedPerformanceType}
                  onChange={value => {
                    setSelectedPerformanceType(value);
                  }}
                />
                <Select
                  placeholder="장비"
                  options={deviceOptions}
                  value={selectedDevice}
                  onChange={value => {
                    setSelectedDevice(value);
                  }}
                />
                <DatePicker.RangePicker
                  value={selectedDateRange}
                  onChange={dates => {
                    if (dates && dates[0] && dates[1]) {
                      setSelectedDateRange([
                        dates[0] as dayjs.Dayjs,
                        dates[1] as dayjs.Dayjs,
                      ]);
                    } else {
                      setSelectedDateRange(null);
                    }
                  }}
                />
                <Button
                  block
                  onClick={() => {
                    if (!selectedDateRange) {
                      message.warning('조회할 기간을 선택해주세요');
                      return;
                    }

                    if (!selectedPerformanceType) {
                      message.warning('성능 종류를 선택해주세요');
                      return;
                    }

                    triggerSubmit(
                      ('구축설비_성능_보고서' +
                        `(${selectedPerformanceType.label})`) as ReportFileName,
                      'html',
                    );
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
                    if (!selectedPerformanceType) {
                      message.warning('성능 종류를 선택해주세요');
                      return;
                    }

                    if (!selectedDateRange) {
                      message.warning('조회할 기간을 선택해주세요');
                      return;
                    }
                    triggerSubmit(
                      ('구축설비_성능_보고서' +
                        `(${selectedPerformanceType.label})`) as ReportFileName,
                      'pdf',
                    );
                  }}
                >
                  PDF로 저장
                </Button>
                <Button
                  block
                  onClick={() => {
                    if (!selectedPerformanceType) {
                      message.warning('성능 종류를 선택해주세요');
                      return;
                    }

                    if (!selectedDateRange) {
                      message.warning('조회할 기간을 선택해주세요');
                      return;
                    }
                    triggerSubmit(
                      ('구축설비_성능_보고서' +
                        `(${selectedPerformanceType.label})`) as ReportFileName,
                      'excel',
                    );
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

export default PerformanceStatisticsTab;

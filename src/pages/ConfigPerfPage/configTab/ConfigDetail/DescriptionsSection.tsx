import { useMemo } from 'react';
import { Descriptions } from 'antd';
import dayjs from 'dayjs';
import { ResConfigDeviceDetails } from '@/types/api/configPerf';
import { tableLabelMap } from '@/types/mappers';
import { YEAR_DATE_FORMAT } from '@/config';

interface Props {
  resDeviceDetails: ResConfigDeviceDetails;
}

const DescriptionsSection = ({ resDeviceDetails }: Props) => {
  const leftColumn = useMemo(() => {
    if (!resDeviceDetails) return;

    return [
      {
        key: resDeviceDetails.deviceNm,
        label: tableLabelMap.deviceNm,
        children: resDeviceDetails.deviceNm,
        span: 3,
      },
      {
        key: resDeviceDetails.deviceKindNm,
        label: tableLabelMap.deviceKindNm,
        children: resDeviceDetails.deviceKindNm,
        span: 3,
      },
      {
        key: resDeviceDetails.deviceKey,
        label: tableLabelMap.deviceKey,
        children: resDeviceDetails.deviceKey,
        span: 3,
      },

      {
        key: resDeviceDetails.managementNm,
        label: tableLabelMap.managementNm,
        children: resDeviceDetails.managementNm,
        span: 3,
      },
      // {
      //   key: resDeviceDetails.stationNm,
      //   label: tableLabelMap.stationNm,
      //   children: resDeviceDetails.stationNm,
      //   span: 3,
      // },
      {
        key: resDeviceDetails.installCompany,
        label: tableLabelMap.installCompany,
        children: resDeviceDetails.installCompany,
        span: 3,
      },
      {
        key: resDeviceDetails.productCompany,
        label: tableLabelMap.productCompany,
        children: resDeviceDetails.productCompany,
        span: 3,
      },
      {
        key: resDeviceDetails.installDate ?? '',
        label: tableLabelMap.installDate,
        children: !resDeviceDetails.installDate
          ? ''
          : dayjs(resDeviceDetails.installDate).format(YEAR_DATE_FORMAT),

        span: 3,
      },
      {
        key: resDeviceDetails.modelNm ?? '',
        label: tableLabelMap.modelNm,
        children: resDeviceDetails.modelNm ?? '',
        span: 3,
      },
      {
        key: resDeviceDetails.deviceIp,
        label: tableLabelMap.deviceIp,
        children: resDeviceDetails.deviceIp,
        span: 3,
      },
      {
        key: resDeviceDetails.pstnNm ?? '',
        label: tableLabelMap.pstnNm,
        children: resDeviceDetails.pstnNm ?? '',
        span: 3,
      },
      // {
      //   key: resDeviceDetails.sysUptime,
      //   label: tableLabelMap.sysUptime,
      //   children: resDeviceDetails.sysUptime,
      //   span: 3,
      // },
    ];
  }, [resDeviceDetails]);

  const rightColumn = useMemo(() => {
    if (!resDeviceDetails) return;

    return [
      {
        key: resDeviceDetails.manageYnNm,
        label: tableLabelMap.manageYnNm,
        children: resDeviceDetails.manageYnNm,
        span: 3,
      },
      {
        key: resDeviceDetails.managerANm,
        label: tableLabelMap.managerANm,
        children: resDeviceDetails.managerANm,
        span: 3,
      },
      {
        key: resDeviceDetails.departmentA,
        label: tableLabelMap.departmentA,
        children: resDeviceDetails.departmentA,
        span: 3,
      },
      {
        key: resDeviceDetails.phoneA,
        label: tableLabelMap.phoneA,
        children: resDeviceDetails.phoneA,
        span: 3,
      },
      {
        key: resDeviceDetails.emailA,
        label: tableLabelMap.emailA,
        children: resDeviceDetails.emailA,
        span: 3,
      },
      {
        key: resDeviceDetails.managerBNm,
        label: tableLabelMap.managerBNm,
        children: resDeviceDetails.managerBNm,
        span: 3,
      },
      {
        key: resDeviceDetails.departmentB,
        label: tableLabelMap.departmentB,
        children: resDeviceDetails.departmentB,
        span: 3,
      },
      {
        key: resDeviceDetails.phoneB,
        label: tableLabelMap.phoneB,
        children: resDeviceDetails.phoneB,
        span: 3,
      },
      {
        key: resDeviceDetails.emailB,
        label: tableLabelMap.emailB,
        children: resDeviceDetails.emailB,
        span: 3,
      },
    ];
  }, [resDeviceDetails]);

  return (
    <>
      <Descriptions column={1} bordered size="small" items={leftColumn} />
      <Descriptions column={1} bordered size="small" items={rightColumn} />
    </>
  );
};

export default DescriptionsSection;

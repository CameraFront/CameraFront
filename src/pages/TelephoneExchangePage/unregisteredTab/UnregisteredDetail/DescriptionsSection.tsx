import { useMemo } from 'react';
import { Descriptions } from 'antd';
import dayjs from 'dayjs';
import { ResUnregisteredPhoneDetails } from '@/types/api/telephoneExchange';
import { tableLabelMap } from '@/types/mappers';
import { YEAR_DATE_FORMAT } from '@/config';

interface Props {
  resUnregisteredPhoneDetails: ResUnregisteredPhoneDetails;
}

const DescriptionsSection = ({ resUnregisteredPhoneDetails }: Props) => {
  const leftColumn = useMemo(() => {
    if (!resUnregisteredPhoneDetails) return;

    return [
      {
        key: resUnregisteredPhoneDetails.managementNm,
        label: tableLabelMap.managementNm,
        children: resUnregisteredPhoneDetails.managementNm,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.phoneKey,
        label: tableLabelMap.phoneKey,
        children: resUnregisteredPhoneDetails.phoneKey,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.ipAddr,
        label: tableLabelMap.deviceIp,
        children: resUnregisteredPhoneDetails.ipAddr,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.internalNum,
        label: tableLabelMap.internalNum,
        children: resUnregisteredPhoneDetails.internalNum,
        span: 3,
      },

      {
        key: resUnregisteredPhoneDetails.phoneStatus,
        label: tableLabelMap.phoneStatus,
        children: resUnregisteredPhoneDetails.phoneStatus,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.regDt ?? '',
        label: tableLabelMap.regDate,
        children: !resUnregisteredPhoneDetails.regDt
          ? ''
          : dayjs(resUnregisteredPhoneDetails.regDt).format(YEAR_DATE_FORMAT),
        span: 3,
      },
    ];
  }, [resUnregisteredPhoneDetails]);

  const rightColumn = useMemo(() => {
    if (!resUnregisteredPhoneDetails) return;

    return [
      {
        key: resUnregisteredPhoneDetails.phoneTypeNm,
        label: tableLabelMap.phoneTypeNm,
        children: resUnregisteredPhoneDetails.phoneTypeNm,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.phoneLocation,
        label: tableLabelMap.phoneLocation,
        children: resUnregisteredPhoneDetails.phoneLocation,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.macAddr,
        label: tableLabelMap.macAddr,
        children: resUnregisteredPhoneDetails.macAddr,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.externalNum,
        label: tableLabelMap.externalNum,
        children: resUnregisteredPhoneDetails.externalNum,
        span: 3,
      },
      {
        key: resUnregisteredPhoneDetails.manageYn,
        label: tableLabelMap.manageYnNm,
        children: resUnregisteredPhoneDetails.manageYn,
        span: 3,
      },
    ];
  }, [resUnregisteredPhoneDetails]);

  return (
    <>
      <Descriptions column={1} bordered size="small" items={leftColumn} />
      <Descriptions column={1} bordered size="small" items={rightColumn} />
    </>
  );
};

export default DescriptionsSection;

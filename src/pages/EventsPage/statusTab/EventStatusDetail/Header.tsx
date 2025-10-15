import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useGetConfigDeviceDetailsQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';

const Header = () => {
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.safeParse(deviceId);
  const { data: deviceDetail } = useGetConfigDeviceDetailsQuery(
    parsedDeviceId.data || 0,
    {
      skip: !parsedDeviceId.success,
    },
  );

  return (
    <Wrapper>
      <div className="device-name">{deviceDetail?.deviceNm}</div>
      <div className="left-group" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 32px;

  .device-name {
    font-size: ${themeGet('fontSizes.s4')};
    font-weight: ${themeGet('fontWeights.medium')};
    background-color: ${themeGet('colors.gray100')};
    border: 1px solid ${themeGet('colors.gray300')};
    border-radius: ${themeGet('borderRadius.normal')};
    padding: 0 ${themeGet('spacing.s2')};
  }
`;

export default Header;

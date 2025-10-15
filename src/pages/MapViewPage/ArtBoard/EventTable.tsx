import { Link } from 'react-router-dom';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { SpotItemNodeData } from '@/types/api/mapView';
import { ROUTES } from '@/config/routes';

interface Props {
  data: SpotItemNodeData;
}

const EventTable = ({ data }: Props) => (
  <Wrapper>
    <div className="title">{data.managementNm} 장애현황</div>
    <div className="row">
      <div className="label" style={{color: '#FE4F4C'}} >긴급</div>
      <div className="value">{data.urgent}</div>
    </div>
    <div className="row">
      <div className="label" style={{color: '#FAC958'}} >중요</div>
      <div className="value">{data.important}</div>
    </div>
    <div className="row">
      <div className="label" style={{color: '#BFBFBF'}} >일반</div>
      <div className="value" >{data.minor}</div>
    </div>
    <div className="row">
      <div className="label total" >합계</div>
      <div className="value">{data.total}</div>
    </div>
    <Link to={`${ROUTES.EVENTS_STATUS}/${data.managementCd}`}>
      <div 
        className='event-btn'
        typeof='button'>
          자세히 보기
      </div>
    </Link>
  </Wrapper>
);

const Wrapper = styled.div`
  width: 16rem;
  padding-top: 4px;

  display: flex;
  flex-direction: column;
  gap: 6px;

  .title {
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 15px;
  }

  .row {
    display: flex;
    gap: 5.5rem;
    padding: 0px 4px;

    .label {
      padding: 0px 6px;
      border-radius: ${themeGet('borderRadius.normal')};

      &.total {
        color: ${themeGet('colors.textTableDevice')};
      }
    }

    .line{
      height: 100%;
      border-left: 1px solid red;
    }
  }

  .event-btn {
    margin: auto;
    margin-top: 16px;
    padding: 3px 0px;
    
    width: 98px;
    text-align: center;
    font-size: 12px;
    border-radius: 29px;
    border: 1px solid red;
    color: ${themeGet('colors.textMapPopover')};
    background-color: ${themeGet('colors.bgMapPopoverBtn')};
  }
`;
export default EventTable;

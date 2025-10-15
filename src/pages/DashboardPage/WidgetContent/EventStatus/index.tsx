import { EventStatusWidgetData } from '@/types/api/dashboard';
import { WidgetListType } from '@/types/enum';
import EventStatusInCards from './EventStatusInCards';
import EventStatusInTable from './EventStatusInTable';

interface Props {
  data: EventStatusWidgetData;
}

const EventStatus = ({ data }: Props) => {
  if (data.options.listType === WidgetListType.Cards)
    return <EventStatusInCards data={data} />;

  return <EventStatusInTable data={data} />;
};

export default EventStatus;

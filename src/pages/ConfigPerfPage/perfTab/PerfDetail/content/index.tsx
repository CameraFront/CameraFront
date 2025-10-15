import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import CpuContent from './CpuContent';
import DiskContent from './DiskContent';
import MemoryContent from './MemoryContent';
import PortContent from './PortContent';

const Content = () => {
  const [searchParams] = useSearchParams();
  const { contentType } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );

  const content = useMemo(() => {
    switch (contentType) {
      case 'cpu':
        return <CpuContent />;
      case 'memory':
        return <MemoryContent />;
      case 'disk':
        return <DiskContent />;
      case 'port':
        return <PortContent />;
      default:
        return <CpuContent />;
    }
  }, [contentType]);

  return content;
};

export default Content;

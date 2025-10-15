import { Edge, Node } from 'reactflow';
import { z } from 'zod';
import { NetworkNodeData } from '@/features/topologyPage/types';
import {
  resDevicesByTypeSchema,
  resTopologyFaultSchema,
  resTopologyMapContentSchema,
  resTopologyTreeMapListSchema,
  resTopologyTreeMapSchema,
} from '@/services/validation/topology';

export type ResTopologyMapList = z.infer<typeof resTopologyTreeMapListSchema>;

export type ResTopologyMap = z.infer<typeof resTopologyTreeMapSchema>;

export type ResTopologyMapContent = z.infer<typeof resTopologyMapContentSchema>;

export type ResDevicesByType = z.infer<typeof resDevicesByTypeSchema>;

export type ReqUpdateTopologyMap =
  | {
      key: number;
      topologyName: string;
    }
  | {
      key: number;
      content: {
        edgeNode: Edge[];
        dataNode: Node[];
      };
    };

export type NetworkNodeDataWithEvent = NetworkNodeData &
  z.infer<typeof resTopologyFaultSchema>;

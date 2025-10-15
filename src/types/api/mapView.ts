import { Node } from 'reactflow';
import { z } from 'zod';
import {
  backgroundNodeDataSchema,
  resMapViewContentSchema,
  spotItemNodeDataSchema,
} from '@/services/validation/mapView';

export type BackgroundNodeData = z.infer<typeof backgroundNodeDataSchema>;

export type SpotItemNodeData = z.infer<typeof spotItemNodeDataSchema>;

export type BackgroundNode = Node<BackgroundNodeData>;

export type SpotItemNode = Node<SpotItemNodeData>;

export type ReqUpdateMapViewMap =
  | { mapId?: number; dataNode: MapViewNode[] }
  | {
      mapId?: number;
      lineMapNm: string;
    };

export type ResMapViewContent = z.infer<typeof resMapViewContentSchema>;

export type MapViewNode = BackgroundNode | SpotItemNode;

export const isSpotItemNode = (
  node: MapViewNode | null | undefined,
): node is SpotItemNode => node?.type === 'spotItem';

export const isBackgroundMap = (
  node: MapViewNode | null | undefined,
): node is BackgroundNode => node?.type === 'backgroundMap';

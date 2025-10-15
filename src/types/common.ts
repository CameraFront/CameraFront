import React, { ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { z } from 'zod';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import {
  dimensionSchema,
  eventTypeEnSchema,
} from '@/services/validation/common';
import { BranchType, EventLv, OrderType, TopologyBranchType } from './enum';

//
export type RangeValue = [Dayjs | null, Dayjs | null] | null;
export interface SourceItem {
  name: string;
  value: number;
}

export interface Dataset<T = SourceItem> {
  dimensions: string[];
  source: T[];
}

export interface ResPaginationMeta {
  records: number;
  totalPage: number;
  page: number;
  rows: number;
}

export interface CommonTree {
  key: string;
  realKey: string;
  title: string;
  children?: CommonTree[];
}

export interface ResTreeNode
  extends Omit<ResTopologyTreeNode, 'children' | 'type'> {
  type: BranchType;
  children?: ResTreeNode[];
  parentKey?: string;
  depth1?: number;
  depth2?: number;
}
export interface ResTreeNodeSearched
  extends Omit<ResTreeNode, 'children' | 'title'> {
  title: React.ReactNode;
  children?: ResTreeNodeSearched[];
}
export interface ResTopologyTreeNode {
  key: string;
  realKey: string;
  title: string;
  type: TopologyBranchType;
  children?: ResTopologyTreeNode[];
  eventYn?: 0 | 1;
  isLeaf?: boolean;
}

export interface ResTopologyTreeNodeSearched
  extends Omit<ResTopologyTreeNode, 'children' | 'title'> {
  title: React.ReactNode;
  children?: ResTopologyTreeNodeSearched[];
}

export type PathOfBranch = Pick<
  ResTreeNode,
  'title' | 'key' | 'realKey' | 'type'
>[];

export type TopologyPathOfBranch = Pick<
  ResTopologyTreeNode,
  'title' | 'key' | 'realKey' | 'type'
>[];

export type ReqBodyParams = DeviceParams & FilterParams;

export interface DeviceParams {
  managementCd?: number;
  stationCd?: string;
  deviceKind?: number;
  deviceKey?: number;
}

export interface FilterParams {
  fromDate?: string;
  endDate?: string;
  fieldNm?: string;
  sort?: OrderType;
}

export interface Filters {
  range?: NonNullable<RangeValue>;
  search?: string;
  checkedList?: EventTypeEn[];
  sortBy: string;
  order: OrderType;
}

export interface CustomMap {
  [key: string]: string | undefined;
}

export type GenericObject = { [key: string]: any };

export interface EventMessageData {
  id?: number;
  eventCd: string;
  eventCdNm: string;
  eventCnt: number;
  eventClearCd: string;
  eventClearNm: string;
  eventClearCnt: number;
  ocDate: string;
  popup: number;
  eventLevel: EventLv;
  deviceNm: string;
  topicType: number;
}

export interface FileConstraints {
  extensions: string[];
  size: number;
  dimension?: { width: number; height: number };
}

// --------------------------------------------------
export interface QueryResponseSuccess<T = any> {
  status: number;
  message: string;
  response: T;
}

export interface QueryResponseError {
  status: number;
  data: { status: string; message: string };
  message: string;
}

export const isQueryResponseError = (error: any): error is QueryResponseError =>
  error.status !== undefined &&
  error.data !== undefined &&
  error.data.status !== undefined;

export const isQueryResponseErrorData = (
  error: any,
): error is QueryResponseError['data'] =>
  error.status !== undefined && error.message !== undefined;

export type QueryResponse<T = any> = QueryReturnValue<
  QueryResponseSuccess<T>,
  QueryResponseError,
  FetchBaseQueryMeta
>;

export type Dimension = z.infer<typeof dimensionSchema>;
export type EventTypeEn = z.infer<typeof eventTypeEnSchema>;
export const eventKrToEn: Record<string, EventTypeEn> = {
  긴급: 'urgent',
  중요: 'important',
  일반: 'minor',
};
export interface BreadcrumbItem {
  key: number;
  title: ReactNode;
}

export interface TreeNode {
  key: number;
  title: ReactNode;
  parentKey: number | null;
  isLeaf: boolean;
  children?: TreeNode[];
}

export interface CriticalEvent {
  id?: number;
  eventCd: string;
  eventCdNm: string;
  eventCnt: number;
  eventClearCd: string;
  eventClearNm: string;
  eventClearCnt: number;
  ocDate: string;
  popup: number;
  eventLevel: EventLv;
  deviceNm: string;
  topicType: number;
}

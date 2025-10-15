import { message } from 'antd';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { QueryResponseError } from '@/types/common';
import { ResStatusCode } from '@/types/enum';

export const queryErrorHandler: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejectedWithValue(action)) {
      const error: QueryResponseError = action.payload;
      const { meta } = action;
      if (error.status === ResStatusCode.Unauthorized) {
        if (error.message) {
          message.error(error.message);
        } else {
          message.error('로그인이 필요합니다.');
        }
        console.error('Unauthorized Error: ', error);
      }

      if (error.status === ResStatusCode.BadRequest) {
        if (error.message) {
          message.error(error.message);
        } else {
          message.error('잘못된 요청입니다.');
        }
        console.error(`Bad Request(${meta?.arg?.queryCacheKey}): `, error);
      }

      if (error.status === ResStatusCode.UnprocessableEntity) {
        if (error.message) {
          message.error(error.message);
        } else {
          message.error('서버로부터 처리할 수 없는 데이터를 받았습니다.');
        }
        console.error(
          `Unprocessable Entity(${meta?.arg?.queryCacheKey}): `,
          error,
        );
      }

      if (error.status === ResStatusCode.InternalServerError) {
        // if (error.message) {
        //   message.error(error.message);
        // } else {
        message.error('서버로부터 정상적인 응답을 받지 못했습니다.');
        // }
        console.error(
          `Internal Server Error(${meta?.arg?.endpointName}): `,
          error,
        );
      }
    }

    return next(action);
  };

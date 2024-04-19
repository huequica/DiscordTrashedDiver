import { ClientRequest, IncomingHttpHeaders, IncomingMessage } from 'http';
import {
  ApiRequestError,
  ApiResponseError,
  TwitterApiErrorData,
} from 'twitter-api-v2';

export const mockTwitterApiRequestError = new ApiRequestError('mock error!', {
  request: {} as unknown as ClientRequest,
  error: new Error(),
});

export const generateMockTwitterApiResponseError = (code: number) =>
  new ApiResponseError('mock error!', {
    request: {} as unknown as ClientRequest,
    response: {} as unknown as IncomingMessage,
    headers: {} as unknown as IncomingHttpHeaders,
    data: {} as unknown as TwitterApiErrorData,
    code,
  });

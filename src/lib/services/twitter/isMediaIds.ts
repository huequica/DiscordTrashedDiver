import { TwitterApi } from 'twitter-api-v2';

export type MediaIds = NonNullable<
  NonNullable<Parameters<TwitterApi['v2']['tweet']>[0]['media']>['media_ids']
>;

export const isMediaIds = (ids: string[]): ids is MediaIds => {
  return ids.length > 1 && ids.length <= 4;
};

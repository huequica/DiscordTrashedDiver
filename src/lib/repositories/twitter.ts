import { TwitterApi, TUploadableMedia } from 'twitter-api-v2';
import { TWITTER_TOKENS } from '@/config/env';

/**
 * Twitter への投稿を管轄する repository
 */
export class TwitterRepository {
  private client: TwitterApi;

  constructor(keys: ReturnType<typeof TWITTER_TOKENS>) {
    this.client = new TwitterApi({
      appKey: keys.consumer.key,
      appSecret: keys.consumer.secret,
      accessToken: keys.account.key,
      accessSecret: keys.account.secret,
    });
  }

  /**
   * テキストをツイートする
   * WIP: 画像などのメディアを添付する(repository 設計もまだ)
   * @param content ツイート文面
   * @param mediaIds 画像メディア郡
   */
  async postTweet(content: string, mediaIds?: string[]) {
    const requestParams: Parameters<typeof this.client.v2.tweet>[0] = {
      text: content,
    };

    if (mediaIds) {
      requestParams.media = {
        media_ids: mediaIds,
      };
    }

    return await this.client.v2.tweet(requestParams);
  }

  /**
   * ファイルをアップロードする
   * @param file ファイルの宛先だったり buffer 本体
   * @return {Promise<string>} メディアの id
   */
  async uploadMedia(file: TUploadableMedia) {
    return await this.client.v1.uploadMedia(file);
  }

  /**
   * tweet を削除する
   * @param tweetId ツイートのId 123456789012345 みたいな数値形式になってる
   * @return {Promise}
   */
  async deleteTweet(tweetId: string) {
    return await this.client.v2.deleteTweet(tweetId);
  }
}

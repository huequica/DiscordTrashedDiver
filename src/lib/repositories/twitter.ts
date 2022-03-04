import Twitter from 'twitter-api-v2';
import { TWITTER_TOKENS } from '@/config/env';

/**
 * Twitter への投稿を管轄する repository
 */
export class TwitterRepository {
  private client: Twitter;

  constructor(keys: ReturnType<typeof TWITTER_TOKENS>) {
    this.client = new Twitter({
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
   */
  async postTweet(content: string) {
    return this.client.v1.tweet(content);
  }
}

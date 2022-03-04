import { TwitterClient } from 'twitter-api-client';
import { TWITTER_TOKENS } from '@/config/env';

/**
 * Twitter への投稿を
 */
export class TwitterRepository {
  private client: TwitterClient;

  constructor(keys: ReturnType<typeof TWITTER_TOKENS>) {
    this.client = new TwitterClient({
      apiKey: keys.consumer.key,
      apiSecret: keys.consumer.secret,
      accessToken: keys.account.key,
      accessTokenSecret: keys.account.secret,
    });
  }

  /**
   * テキストをツイートする
   * WIP: 画像などのメディアを添付する(repository 設計もまだ)
   * @param content ツイート文面
   */
  async postTweet(content: string) {
    return this.client.tweets.statusesUpdate({ status: content });
  }
}

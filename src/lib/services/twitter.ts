/* eslint-disable indent */
import { ApiRequestError, ApiResponseError } from 'twitter-api-v2';
import { TwitterRepository } from '@/lib/repositories/twitter';
import { TWITTER_TOKENS } from '@/config/env';
import {
  NetworkHandshake,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';

export class TwitterService {
  private repository: TwitterRepository;

  constructor(repository?: TwitterRepository) {
    this.repository = repository || new TwitterRepository(TWITTER_TOKENS());
  }

  /**
   * twitter へ文面を投稿する
   * @param content ツイート文面
   * @return {Promise<string>} ツイートのリンク
   */
  async postTweet(content: string): Promise<string> {
    try {
      return await this.repository
        .postTweet(content)
        .then(
          (res) =>
            `https://twitter.com/${res.user.screen_name}/status/${res.id_str}`
        );
    } catch (error: unknown) {
      // シンプルに疎通ができなかったなどのエラー
      if (error instanceof ApiRequestError) {
        throw new NetworkHandshake();
      }
      // twitter から エラーのレスポンスが返却されたなどのエラー

      if (error instanceof ApiResponseError) {
        switch (error.code) {
          case 401:
            throw new UnauthorizedException();
          case 500:
            throw new ServerErrorException();
        }
      }
      throw error;
    }
  }
}

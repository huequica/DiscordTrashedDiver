/* eslint-disable indent */
import { ApiRequestError, ApiResponseError } from 'twitter-api-v2';
import { TwitterRepository } from '@/lib/repositories/twitter';
import { TWITTER_TOKENS } from '@/config/env';
import fs from 'fs/promises';
import {
  NetworkHandshakeException,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';
import { saveToTmpFile } from '@/actions/utils/saveFileToTmp';

export class TwitterService {
  private repository: TwitterRepository;

  constructor(repository?: TwitterRepository) {
    this.repository = repository || new TwitterRepository(TWITTER_TOKENS());
  }

  /**
   * twitter へ文面を投稿する
   * @param content ツイート文面
   * @param mediaIds 画像郡
   * @return {Promise<string>} ツイートのリンク
   */
  async postTweet(content: string, mediaIds?: string[]): Promise<string> {
    try {
      return await this.repository
        .postTweet(content, mediaIds)
        .then(
          (res) => `https://twitter.com/leakFromSawada/status/${res.data.id}`
        );
    } catch (error: unknown) {
      // シンプルに疎通ができなかったなどのエラー
      if (error instanceof ApiRequestError) {
        throw new NetworkHandshakeException();
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

  /**
   * URLの情報をファイルに保存して media をアップロードし、 id を取得する
   * @param url
   * @return Twitter 上の media_id
   */
  async uploadMedia(url: string): Promise<string> {
    try {
      const filePath = await saveToTmpFile(url);
      return await this.repository.uploadMedia(filePath).then((res) => {
        // upload が完了し次第 tmp のファイルは削除
        fs.rm(filePath);
        return res;
      });
    } catch (error) {
      // シンプルに疎通ができなかったなどのエラー
      if (error instanceof ApiRequestError) {
        throw new NetworkHandshakeException();
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

  async deleteTweet(tweetId: string): Promise<boolean> {
    try {
      return await this.repository
        .deleteTweet(tweetId)
        .then((res) => Boolean(res));
    } catch (error: unknown) {
      // シンプルに疎通ができなかったなどのエラー
      if (error instanceof ApiRequestError) {
        throw new NetworkHandshakeException();
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

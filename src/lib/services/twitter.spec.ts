import { TwitterRepository } from '@/lib/repositories/twitter';
import { TwitterService } from '@/lib/services/twitter';
import {
  NetworkHandshakeException,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';
import {
  generateMockTwitterApiResponseError,
  mockTwitterApiRequestError,
} from '@/lib/mocks/errors';
import { mockTweet } from '@/lib/mocks/twitter';
import { mockTwitterTokens } from '@/lib/mocks/env';

describe('🚓 TwitterService#postTweet', () => {
  describe('🆗 RESOLVED', () => {
    it('👮 正常終了の場合は Twitter のURLを構築して返す', async () => {
      const repository = new TwitterRepository(mockTwitterTokens);
      repository.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockTweet));
      const service = new TwitterService(repository);

      const expectURL = `https://twitter.com/leakFromSawada/status/${mockTweet.data.id}`;
      expect(await service.postTweet('sample content tweet!')).toBe(expectURL);
    });
  });

  describe('🆖 REJECTED', () => {
    it('👮 ApiRequestError が返却されたときは NetworkHandshake を throw する', async () => {
      const repository = new TwitterRepository(mockTwitterTokens);
      repository.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(mockTwitterApiRequestError));

      const service = new TwitterService(repository);
      await expect(
        service.postTweet('sample content tweet!')
      ).rejects.toThrowError(NetworkHandshakeException);
    });

    it('👮 401 が返却された場合は UnauthorizedException を throw する', async () => {
      const repository = new TwitterRepository(mockTwitterTokens);
      repository.postTweet = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(generateMockTwitterApiResponseError(401))
        );

      const service = new TwitterService(repository);

      await expect(
        service.postTweet('sample content tweet!')
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('👮 500 が返却された場合は ServerErrorException を throw する', async () => {
      const repository = new TwitterRepository(mockTwitterTokens);
      repository.postTweet = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(generateMockTwitterApiResponseError(500))
        );

      const service = new TwitterService(repository);

      await expect(
        service.postTweet('sample content tweet!')
      ).rejects.toThrowError(ServerErrorException);
    });
  });
});

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

describe('๐ TwitterService#postTweet', () => {
  describe('๐ RESOLVED', () => {
    it('๐ฎ ๆญฃๅธธ็ตไบใฎๅ ดๅใฏ Twitter ใฎURLใๆง็ฏใใฆ่ฟใ', async () => {
      const repository = new TwitterRepository(mockTwitterTokens);
      repository.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockTweet));
      const service = new TwitterService(repository);

      const expectURL = `https://twitter.com/${mockTweet.user.screen_name}/status/${mockTweet.id_str}`;
      expect(await service.postTweet('sample content tweet!')).toBe(expectURL);
    });
  });

  describe('๐ REJECTED', () => {
    it('๐ฎ ApiRequestError ใ่ฟๅดใใใใจใใฏ NetworkHandshake ใ throw ใใ', async () => {
      const repository = new TwitterRepository(mockTwitterTokens);
      repository.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(mockTwitterApiRequestError));

      const service = new TwitterService(repository);
      await expect(
        service.postTweet('sample content tweet!')
      ).rejects.toThrowError(NetworkHandshakeException);
    });

    it('๐ฎ 401 ใ่ฟๅดใใใๅ ดๅใฏ UnauthorizedException ใ throw ใใ', async () => {
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

    it('๐ฎ 500 ใ่ฟๅดใใใๅ ดๅใฏ ServerErrorException ใ throw ใใ', async () => {
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

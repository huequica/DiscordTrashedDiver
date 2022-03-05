import { leakMessage } from '@/actions/leakMessage';
import {
  generateMockMessageReaction,
  GenerateMockMessageReactionOptions,
} from '@/lib/mocks/messageReaction';
import { TwitterService } from '@/lib/services/twitter';
import { TwitterRepository } from '@/lib/repositories/twitter';
import { mockTwitterTokens } from '@/lib/mocks/env';

describe('🚓 leakMessage', () => {
  it('👮 フィルターを通った場合は reaction.reply.message が発火する', () => {
    const reactionMock = generateMockMessageReaction();

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).toHaveBeenCalledWith(':troll_face:');
  });

  it('👮 フィルターを通らない場合は void で早期リターンする', () => {
    const mockReactionOptions: GenerateMockMessageReactionOptions = {
      channel: {
        name: 'general',
      },
      emoji: {
        name: 'troll_face',
      },
    };

    const reactionMock = generateMockMessageReaction(mockReactionOptions);

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).not.toHaveBeenCalled();
  });

  describe('🆗 RESOLVE ALL', () => {
    it('👮 twitter への投稿まですべて通った場合は twitter のURLを送信する', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      const tweetURL = 'https://twitter.com/mockUser/status/01234567890123';
      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.resolve(tweetURL));

      const reactionMock = generateMockMessageReaction();

      reactionMock.client.emojis.cache.find = jest
        .fn()
        .mockImplementation(() => ({
          name: 'boomerang',
          toString: () => ':boomerang:',
        }));

      await leakMessage(reactionMock, {
        twitter: twitterService,
      });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        `:boomerang: ${tweetURL}`
      );
    });
  });
});

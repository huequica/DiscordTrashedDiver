import { leakMessage } from '@/actions/leakMessage';
import {
  generateMockMessageReaction,
  GenerateMockMessageReactionOptions,
} from '@/lib/mocks/messageReaction';
import { TwitterService } from '@/lib/services/twitter';
import { TwitterRepository } from '@/lib/repositories/twitter';
import { mockTwitterTokens } from '@/lib/mocks/env';
import {
  ContentsTooLongException,
  NetworkHandshakeException,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';
import { buildNoMentionReply } from '@/actions/utils/buildNoMentionReply';

describe('ð leakMessage', () => {
  it('ð® ãã£ã«ã¿ã¼ãéããªãå ´åã¯ void ã§æ©æãªã¿ã¼ã³ãã', () => {
    const mockReactionOptions: GenerateMockMessageReactionOptions = {
      channel: {
        name: 'general',
      },
      emoji: {
        name: 'thinking_mikan',
      },
    };

    const reactionMock = generateMockMessageReaction(mockReactionOptions);

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).not.toHaveBeenCalled();
  });

  describe('ð RESOLVE ALL', () => {
    it('ð® twitter ã¸ã®æç¨¿ã¾ã§ãã¹ã¦éã£ãå ´åã¯ twitter ã®URLãéä¿¡ãã, ãªã¢ã¯ã·ã§ã³ãæ¶ã', async () => {
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
          name: 'watching_you2',
          toString: () => ':watching_you2:',
        }));

      await leakMessage(reactionMock, {
        twitter: twitterService,
      });

      const replyOptions = buildNoMentionReply(`:watching_you2: ${tweetURL}`);

      expect(reactionMock.message.reply).toHaveBeenCalledWith(replyOptions);
      expect(reactionMock.remove).toHaveBeenCalled();
    });
  });

  describe('ð REJECTED', () => {
    it('ð® ContentsTooLongException ãå¸°ã£ã¦ããããã®åé¡ãéç¥, ãªã¢ã¯ã·ã§ã³ãæ¶ã', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(new ContentsTooLongException())
        );
      const reactionMock = generateMockMessageReaction();
      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        buildNoMentionReply(`${reactionMock.emoji} < ãã®æç¨¿é·ãããªãã ã`)
      );
    });

    it('ð® NetworkHandshakeException ãå¸°ã£ã¦ããããã®åé¡ãéç¥', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(new NetworkHandshakeException())
        );

      const reactionMock = generateMockMessageReaction();
      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        buildNoMentionReply(
          `${reactionMock.emoji} < ãããã¯ã¼ã¯ã®æ¥ç¶ã§åé¡ãçºçããã½ãã§`
        )
      );
    });

    it('ð® UnauthorizedException ãå¸°ã£ã¦ããããã®åé¡ãéç¥', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(new UnauthorizedException()));

      const reactionMock = generateMockMessageReaction();
      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        buildNoMentionReply(
          `${reactionMock.emoji} < twitter ã®èªè¨¼ã§æ­»ãã ãã ã`
        )
      );
    });

    it('ð® ServerErrorException ãå¸°ã£ã¦ããããã®åé¡ãéç¥', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(new ServerErrorException()));

      const reactionMock = generateMockMessageReaction();
      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        buildNoMentionReply(
          `${reactionMock.emoji} < Twitter ã®ãµã¼ãã¹ãæ­»ãã§ãããããã`
        )
      );
    });

    it('ð® ãã®ä»ã¨ã©ã¼ ãå¸°ã£ã¦ãããã¨ã©ã¼ã¡ãã»ã¼ã¸ãæ·»ä»ãã¦éç¥', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('mockError!')));

      const reactionMock = generateMockMessageReaction();
      const errorMessage = '```\n' + `mockError!\n` + '```';

      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        buildNoMentionReply(
          `${reactionMock.emoji} < ãªããç¥ããã¨ã©ã¼ãåºãã`
        )
      );
      expect(reactionMock.message.channel.send).toHaveBeenCalledWith(
        errorMessage
      );
    });
  });
});

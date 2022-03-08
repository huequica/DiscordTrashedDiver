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

describe('🚓 leakMessage', () => {
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
          name: 'watching_you2',
          toString: () => ':watching_you2:',
        }));

      await leakMessage(reactionMock, {
        twitter: twitterService,
      });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        `:watching_you2: ${tweetURL}`
      );
    });
  });

  describe('🆖 REJECTED', () => {
    it('👮 ContentsTooLongException が帰ってきたらその問題を通知', async () => {
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
        `${reactionMock.emoji} < この投稿長すぎなんだわ`
      );
    });

    it('👮 NetworkHandshakeException が帰ってきたらその問題を通知', async () => {
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
        `${reactionMock.emoji} < ネットワークの接続で問題が発生したぽいで`
      );
    });

    it('👮 UnauthorizedException が帰ってきたらその問題を通知', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(new UnauthorizedException()));

      const reactionMock = generateMockMessageReaction();
      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        `${reactionMock.emoji} < twitter の認証で死んだんだわ`
      );
    });

    it('👮 ServerErrorException が帰ってきたらその問題を通知', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(new ServerErrorException()));

      const reactionMock = generateMockMessageReaction();
      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        `${reactionMock.emoji} < Twitter のサービスが死んでるかもしれん`
      );
    });

    it('👮 その他エラー が帰ってきたらエラーメッセージも添付して通知', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.postTweet = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('mockError!')));

      const reactionMock = generateMockMessageReaction();
      const errorMessage = '```\n' + `mockError!\n` + '```';

      await leakMessage(reactionMock, { twitter: twitterService });

      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        `${reactionMock.emoji} < なんか知らんエラーが出たわ`
      );
      expect(reactionMock.message.channel.send).toHaveBeenCalledWith(
        errorMessage
      );
    });
  });
});

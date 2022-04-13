import { removeTweet } from '@/actions/removeTweet';
import {
  generateMockMessageReaction,
  GenerateMockMessageReactionOptions,
} from '@/lib/mocks/messageReaction';
import { generateMockUser } from '@/lib/mocks/user';
import { TwitterRepository } from '@/lib/repositories/twitter';
import { mockTwitterTokens } from '@/lib/mocks/env';
import { TwitterService } from '@/lib/services/twitter';
import { buildNoMentionReply } from '@/actions/utils/buildNoMentionReply';

describe('🚓 removeTweet', () => {
  it('👮 フィルターを通らない場合は void で早期リターンする', () => {
    const mockReactionOptions: GenerateMockMessageReactionOptions = {
      channel: {
        name: 'general',
      },
      emoji: {
        name: 'x',
      },
    };

    const reactionMock = generateMockMessageReaction(mockReactionOptions);
    removeTweet(reactionMock, generateMockUser());
    expect(reactionMock.message.reply).not.toHaveBeenCalled();
  });

  describe('🆗 RESOLVED', () => {
    it('👮 すべて正常終了した場合は指定のメッセージで reply する', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.deleteTweet = () => Promise.resolve(true);

      const reactionMock = generateMockMessageReaction({
        message: {
          referenceUserId: 'mockUser',
          content: 'https://twitter.com/hogeUser/status/12345678901234568901',
        },
        emoji: {
          name: 'x',
        },
      });
      const reactionUserMock = generateMockUser({ id: 'mockUser' });

      await removeTweet(reactionMock, reactionUserMock, {
        twitter: twitterService,
      });
      expect(reactionMock.message.reply).toHaveBeenCalledWith(
        'ツイート削除したで. 念の為リンク踏んで確認してな'
      );
    });
  });

  describe('🆖 REJECTED', () => {
    it('👮 tweetId の取得に失敗したときに Error のテキストが投下される', async () => {
      const twitterRepository = new TwitterRepository(mockTwitterTokens);
      const twitterService = new TwitterService(twitterRepository);

      twitterService.deleteTweet = () => Promise.resolve(true);

      const reactionMock = generateMockMessageReaction({
        message: {
          referenceUserId: 'mockUser',
          content: 'https://hoge.com/hogeUser/12345678901234568901',
        },
        emoji: {
          name: 'x',
        },
      });
      const reactionUserMock = generateMockUser({ id: 'mockUser' });

      await removeTweet(reactionMock, reactionUserMock, {
        twitter: twitterService,
      });

      const replyOption = buildNoMentionReply(
        `${reactionMock.emoji} < なんか知らんエラーが出たわ`
      );
      expect(reactionMock.message.reply).toHaveBeenCalledWith(replyOption);

      const errorMessage = 'Throw unexpected URL!';
      const text = '```\n' + `${errorMessage}\n` + '```';

      expect(reactionMock.message.channel.send).toHaveBeenCalledWith(text);
    });
  });
});

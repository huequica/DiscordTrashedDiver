import { leakMessage, shouldRunLeak } from '@/actions/leakMessage';
import {
  generateMockMessageReaction,
  GenerateMockMessageReactionOptions,
} from '@/lib/mocks/messageReaction';

describe('🚓 shouldRunLeak', () => {
  it('👮 channel.name が "ごみばこ" 以外のときは undefined を返す', () => {
    const mockObject = { channelName: 'mockChannel', emojiName: 'troll_face' };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 reaction.emoji.name が "troll_face" 以外は undefined を返す', () => {
    const mockObject = { channelName: 'ごみばこ', emojiName: 'mockEmoji' };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルで "troll_face" の絵文字の場合は true を返す', () => {
    const mockObject = { channelName: 'ごみばこ', emojiName: 'troll_face' };
    expect(shouldRunLeak(mockObject)).toBe(true);
  });
});

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
});

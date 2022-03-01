import { shouldRunLeak } from '@/actions/leakMessage';

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

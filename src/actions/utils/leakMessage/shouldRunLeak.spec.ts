import { shouldRunLeak } from '@/actions/utils/leakMessage/shouldRunLeak';

describe('🚓 shouldRunLeak', () => {
  const createMockObject = () => ({
    channelName: 'ごみばこ',
    emojiName: 'troll_face',
    isAuthorBot: false,
  });

  it('👮 bot ではないアカウントの発言に所定のチャンネルで所定の emoji がつくと true を返却', () => {
    const mockObject = createMockObject();
    expect(shouldRunLeak(mockObject)).toBe(true);
  });

  it('👮 bot の発言である場合は条件が合っていても falsy な評価を返す', () => {
    const mockObject = createMockObject();
    mockObject.isAuthorBot = true;
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 チャンネルが違う場合は falsy な評価を返す', () => {
    const mockObject = createMockObject();
    mockObject.channelName = 'mockChannel';
    expect(shouldRunLeak(mockObject)).toBeFalsy();
  });

  it('👮 絵文字が違う場合は falsy な評価を返す', () => {
    const mockObject = createMockObject();
    mockObject.emojiName = 'mockEmoji';
    expect(shouldRunLeak(mockObject)).toBeFalsy();
  });
});

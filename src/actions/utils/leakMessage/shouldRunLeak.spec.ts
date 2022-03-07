/* eslint-disable max-len */
// TODO: @huequica ファイルの構造とメッセージ自体を考える
import { shouldRunLeak } from '@/actions/utils/leakMessage/shouldRunLeak';

describe('🚓 shouldRunLeak', () => {
  it('👮 ごみばこチャンネルであり、かつ "troll_face" の絵文字であり、メッセージ送信者がbot自身でない場合は true を返す', () => {
    const mockObject = {
      channelName: 'ごみばこ',
      emojiName: 'troll_face',
      messageAuthor: '000000000000000000',
    };
    expect(shouldRunLeak(mockObject)).toBe(true);
  });

  it('👮 ごみばこチャンネルではない、 "troll_face" の絵文字でもなく、メッセージ送信者がbot自身でない場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'mockChannel',
      emojiName: 'mockEmoji',
      messageAuthor: '000000000000000000',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルではない、 "troll_face" の絵文字でもなく、メッセージ送信者がbot自身である場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'mockChannel',
      emojiName: 'mockEmoji',
      messageAuthor: '947934464779120720',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルではない、 "troll_face" の絵文字であるが、メッセージ送信者がbot自身でない場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'mockChannel',
      emojiName: 'troll_face',
      messageAuthor: '000000000000000000',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルではない、 "troll_face" の絵文字であり、メッセージ送信者がbot自身である場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'mockChannel',
      emojiName: 'troll_face',
      messageAuthor: '947934464779120720',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルであり、 "troll_face" の絵文字ではなく、メッセージ送信者がbot自身でない場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'ごみばこ',
      emojiName: 'mockEmoji',
      messageAuthor: '000000000000000000',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルであり、 "troll_face" の絵文字ではなく、メッセージ送信者がbot自身である場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'ごみばこ',
      emojiName: 'mockEmoji',
      messageAuthor: '947934464779120720',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルであり、かつ "troll_face" の絵文字であり、メッセージ送信者がbot自身である場合は undefined を返す', () => {
    const mockObject = {
      channelName: 'ごみばこ',
      emojiName: 'troll_face',
      messageAuthor: '947934464779120720',
    };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });
});
// hoge

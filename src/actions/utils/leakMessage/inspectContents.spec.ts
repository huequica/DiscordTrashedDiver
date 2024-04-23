import { inspectContents } from '@/actions/utils/leakMessage/inspectContents';
import { ContentsTooLongException } from '@/lib/exceptions';

describe('🚓 pullContents', () => {
  it('👮 アルファベットの文字数が問題ない場合はそのまま返却', () => {
    const message = 'mockMessage!';
    expect(inspectContents(message)).toBe(message);
  });

  it('👮 アルファベットの文字列が長すぎる場合はエラーを throw する', () => {
    const tooLongContent: string[] = new Array(100).fill('mockMessage');
    expect(() => inspectContents(tooLongContent.join(' '))).toThrow(
      ContentsTooLongException,
    );
  });

  it('👮 日本語の文字数が問題ない場合はそのまま返却', () => {
    const message = 'モックメッセージ!';
    expect(inspectContents(message)).toBe(message);
  });

  it('👮 日本語の文字数が長過ぎる場合はエラーを throw する', () => {
    const tooLongContent: string[] = new Array(141).fill('あ');

    expect(() => inspectContents(tooLongContent.join(''))).toThrow(
      ContentsTooLongException,
    );
  });

  it('👮 絵文字の文字数が問題ない場合はそのまま返却', () => {
    const message = '🆗';
    expect(inspectContents(message)).toBe(message);
  });

  it('👮 絵文字の文字数が長過ぎる場合はエラーを throw する', () => {
    const tooLongContent: string[] = new Array(80).fill('🆖');

    expect(() => inspectContents(tooLongContent.join(''))).toThrow(
      ContentsTooLongException,
    );
  });
});

import { pickTweetId } from '@/actions/utils/removeTweet/pickTweetId';

describe('🚓 pickTweetId', () => {
  it('👮 正常例の場合は Id を返却', () => {
    const tweetURL = 'https://twitter.com/hogeUser/status/12345678901';
    const expectId = '12345678901';
    expect(pickTweetId(tweetURL)).toBe(expectId);
  });

  it('👮 URL が twitter の形式と違う場合はエラーを返却', () => {
    const tweetURL = 'https://hoge.com/fuga/piyo';
    expect(() => pickTweetId(tweetURL)).toThrow(Error);
  });

  it('👮 URL の statusId の中に変な文字が混ざっていた場合はエラーを返却', () => {
    const tweetURL = 'https://twitter.com/hogeUser/status/fuga1234567890';
    expect(() => pickTweetId(tweetURL)).toThrow(Error);
  });

  it('👮 URL の末尾に変な文字が混ざっていた場合はエラーを返却', () => {
    const tweetURL = 'https://twitter.com/hogeUser/status/1234678901?s=1';
    expect(() => pickTweetId(tweetURL)).toThrow(Error);
  });
});

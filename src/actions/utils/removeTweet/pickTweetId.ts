/**
 * twitter の URL から statusId のみ切り出して返す
 * @param tweetURL e.g. `https://twitter.com/hogeUser/status/123456`
 * @return e.g. `123456`
 */
export const pickTweetId = (tweetURL: string): string => {
  const splitURL = tweetURL.split('/status/');
  if (splitURL.length <= 1) throw Error('Throw unexpected URL!');
  const statusId = splitURL[1];

  // 行頭, 行末などにへんな string があれば例外を投げる
  const identifierNumberRegEx = /^[0-9]*$/;
  if (!identifierNumberRegEx.test(statusId))
    throw Error('Throw unexpected URL!');

  return statusId;
};

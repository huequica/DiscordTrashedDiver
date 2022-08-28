interface TweetRemoveRuleBases {
  emojiName: string; // ついた emoji の名前
  channelName: string; //チャンネル名
  isReactedMessageAuthorBot: boolean; // emoji がついたメッセージが bot の発言かどうか
  reactorId: string; // リアクションの emoji を追加した人
  referencedMessageAuthorId: string; //リファレンス元の作者
  isBotManager: boolean; // BotManager 権限があるかどうか
}

/**
 * ツイートを消去する Permission があるかどうかを検査
 * - reference 元の筆者
 * - Guild の Owner
 * - bot の Maintainer
 * この3者は削除可能とする
 */
export const shouldRemoveTweet = (rules: TweetRemoveRuleBases): boolean => {
  // bot の発言についたものでなければ無視
  if (!rules.isReactedMessageAuthorBot) return false;

  // emoji.name が `❌` でなければ無視
  if (rules.emojiName !== '❌') return false;

  // チャンネル名がごみばこ以外の場所での発言は無視
  if (rules.channelName !== 'ごみばこ') return false;

  // Bot の Manager 権限がある場合は 許可
  if (rules.isBotManager) return true;

  // 最後に reference 元のユーザーと emoji の追加者が同じ id かどうかを返却
  return rules.reactorId === rules.referencedMessageAuthorId;
};

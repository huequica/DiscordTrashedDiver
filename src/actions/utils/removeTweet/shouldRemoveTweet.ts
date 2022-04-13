interface TweetRemoveRuleBases {
  emojiName: string; // ついた emoji の名前
  channelName: string; //チャンネル名
  isReactedMessageAuthorBot: boolean; // emoji がついたメッセージが bot の発言かどうか
  reactorId: string; // リアクションの emoji を追加した人
  referencedMessageAuthorId: string; //リファレンス元の作者
}

/**
 * ツイートを消去する Permission があるかどうかを検査
 * - reference 元の筆者
 * - Admins(TODO: 一旦要件から除外)
 * - botMaintainer(TODO: 一旦要件から除外)
 * この3者は削除可能とする
 */
export const shouldRemoveTweet = (rules: TweetRemoveRuleBases): boolean => {
  // bot の発言についたものでなければ無視
  if (!rules.isReactedMessageAuthorBot) return false;

  // emoji.name が `x` でなければ無視
  if (rules.emojiName !== 'x') return false;

  // チャンネル名がごみばこ以外の場所での発言は無視
  if (rules.channelName !== 'ごみばこ') return false;

  // 最後に reference 元のユーザーと emoji の追加者が同じ id かどうかを返却
  return rules.reactorId === rules.referencedMessageAuthorId;
};

interface FilterRules {
  channelName: string;
  emojiName: string;
  isAuthorBot: boolean;
}

export const shouldRunLeak = ({
  channelName,
  emojiName,
  isAuthorBot,
}: FilterRules): true | void => {
  // "ごみばこ" の名前のチャンネル以外では発火禁止
  if (channelName !== 'ごみばこ') return;

  // troll_face 以外の emoji の場合は無視
  if (emojiName !== 'troll_face') return;

  // メッセージ送信者がbot自身であれば弾く
  if (isAuthorBot) return;

  return true;
};

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

  // thinking_mikan 以外の emoji の場合は無視
  if (emojiName !== 'thinking_mikan') return;

  // メッセージ送信者がbot自身であれば弾く
  if (isAuthorBot) return;

  return true;
};

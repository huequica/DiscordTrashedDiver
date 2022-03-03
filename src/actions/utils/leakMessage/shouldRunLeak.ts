interface FilterRules {
  channelName: string;
  emojiName: string;
}

export const shouldRunLeak = ({
  channelName,
  emojiName,
}: FilterRules): true | void => {
  // "ごみばこ" の名前のチャンネル以外では発火禁止
  if (channelName !== 'ごみばこ') return;

  // troll_face 以外の emoji の場合は無視
  if (emojiName !== 'troll_face') return;

  return true;
};

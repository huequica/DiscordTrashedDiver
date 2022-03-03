import { MessageReaction } from 'discord.js';
import {
  isTextChannel,
  getChannelFromReaction,
} from '@/typeGuards/isTextChannel';

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

export const leakMessage = (reaction: MessageReaction) => {
  // 原則として来ることはないがコンパイラを黙らせる意味で書いている
  const channel = getChannelFromReaction(reaction);
  if (!isTextChannel(channel)) return;

  const filters: Parameters<typeof shouldRunLeak>[0] = {
    channelName: channel.name,
    emojiName: reaction.emoji.name || '',
  };

  if (!shouldRunLeak(filters)) return;

  reaction.message.reply(reaction.emoji.toString());
};

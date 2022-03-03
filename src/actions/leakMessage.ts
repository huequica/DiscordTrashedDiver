import { MessageReaction } from 'discord.js';
import { shouldRunLeak } from '@/actions/utils/leakMessage/shouldRunLeak';
import {
  isTextChannel,
  getChannelFromReaction,
} from '@/typeGuards/isTextChannel';

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

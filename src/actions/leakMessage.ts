import { MessageReaction } from 'discord.js';
import { shouldRunLeak } from '@/actions/utils/leakMessage/shouldRunLeak';
import {
  isTextChannel,
  getChannelFromReaction,
} from '@/typeGuards/isTextChannel';
import { EmojiNotFoundError } from '@/lib/exceptions';
import { pickEmoji } from '@/actions/utils/pickEmoji';

export const leakMessage = (reaction: MessageReaction) => {
  // 原則として来ることはないがコンパイラを黙らせる意味で書いている
  const channel = getChannelFromReaction(reaction);
  if (!isTextChannel(channel)) return;

  const filters: Parameters<typeof shouldRunLeak>[0] = {
    channelName: channel.name,
    emojiName: reaction.emoji.name || '',
  };

  if (!shouldRunLeak(filters)) return;

  try {
    const emoji = pickEmoji(reaction.client, 'watching_you2');
    reaction.message.reply(emoji.toString());
  } catch (error: unknown) {
    if (error instanceof EmojiNotFoundError) {
      reaction.message.reply(
        `${reaction.emoji} < わりい、使おうとしたやつがないんだわ`
      );
      return;
    }

    throw error;
  }
};

import { buildNoMentionReply } from '@/actions/utils/buildNoMentionReply';
import { pickTweetId } from '@/actions/utils/removeTweet/pickTweetId';
import { shouldRemoveTweet } from '@/actions/utils/removeTweet/shouldRemoveTweet';
import { BOT_MANAGER_ROLE_ID } from '@/config/env';
import {
  NetworkHandshakeException,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';
import { TwitterService } from '@/lib/services/twitter';
import { isTextChannel } from '@/typeGuards/isTextChannel';
import { MessageReaction, User } from 'discord.js';

interface Services {
  twitter: TwitterService;
}

export const removeTweet = async (
  reaction: MessageReaction,
  reactorUser: User,
  services: Services,
) => {
  // 原則として来ることはないがコンパイラを黙らせる意味で書いている
  const channel = reaction.message.channel;
  if (!isTextChannel(channel)) return;

  const managerRole = reaction.message.guild?.roles.cache.get(
    BOT_MANAGER_ROLE_ID(),
  );

  if (!managerRole) {
    throw new Error('Cannot detected manage role in guild!');
  }

  const permission = {
    isOwner: (reaction.message.guild?.ownerId ?? '') === reactorUser.id,
    isManager: Boolean(managerRole.members.get(reactorUser.id)),
  };

  const filter: Parameters<typeof shouldRemoveTweet>[0] = {
    emojiName: reaction.emoji.name || '',
    channelName: channel.name,
    isReactedMessageAuthorBot: reaction.message.author?.bot || false,
    reactorId: reactorUser.id,
    referencedMessageAuthorId: reaction.message.reference
      ? (await reaction.message.fetchReference()).author.id
      : '',
    isBotManager: permission.isOwner || permission.isManager,
  };

  if (!shouldRemoveTweet(filter)) {
    return;
  }

  try {
    const tweetId = pickTweetId(reaction.message.content || '');
    await services.twitter.deleteTweet(tweetId);

    await reaction.message.reply(
      'ツイート削除したで. 念の為リンク踏んで確認してな',
    );
  } catch (error: unknown) {
    if (error instanceof NetworkHandshakeException) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < ネットワークの接続で問題が発生したぽいで`,
        ),
      );
      return;
    }

    if (error instanceof UnauthorizedException) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < services.twitter. の認証で死んだんだわ`,
        ),
      );
      return;
    }

    if (error instanceof ServerErrorException) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < services.twitter. のサービスが死んでるかもしれん`,
        ),
      );
      return;
    }

    if (error instanceof Error) {
      await reaction.message.reply(
        buildNoMentionReply(`${reaction.emoji} < なんか知らんエラーが出たわ`),
      );
      const errorMessage = '```\n' + `${error.message}\n` + '```';
      await reaction.message.channel.send(errorMessage);
      return;
    }
  }
};

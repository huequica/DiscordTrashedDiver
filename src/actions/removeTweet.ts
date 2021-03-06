import { MessageReaction, User } from 'discord.js';
import { TwitterService } from '@/lib/services/twitter';
import { shouldRemoveTweet } from '@/actions/utils/removeTweet/shouldRemoveTweet';
import { pickTweetId } from '@/actions/utils/removeTweet/pickTweetId';
import { buildNoMentionReply } from '@/actions/utils/buildNoMentionReply';
import {
  NetworkHandshakeException,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';
import {
  getChannelFromReaction,
  isTextChannel,
} from '@/typeGuards/isTextChannel';

interface Services {
  twitter: TwitterService;
}

export const removeTweet = async (
  reaction: MessageReaction,
  reactorUser: User,
  services?: Services
) => {
  // 原則として来ることはないがコンパイラを黙らせる意味で書いている
  const channel = getChannelFromReaction(reaction);
  if (!isTextChannel(channel)) return;

  const filter: Parameters<typeof shouldRemoveTweet>[0] = {
    emojiName: reaction.emoji.name || '',
    channelName: channel.name,
    isReactedMessageAuthorBot: reaction.message.author?.bot || false,
    reactorId: reactorUser.id,
    referencedMessageAuthorId: reaction.message.reference
      ? (await reaction.message.fetchReference()).author.id
      : '',
  };

  if (!shouldRemoveTweet(filter)) return;
  const twitterService = services?.twitter || new TwitterService();

  try {
    const tweetId = pickTweetId(reaction.message.content || '');
    await twitterService.deleteTweet(tweetId);

    await reaction.message.reply(
      'ツイート削除したで. 念の為リンク踏んで確認してな'
    );
  } catch (error: unknown) {
    if (error instanceof NetworkHandshakeException) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < ネットワークの接続で問題が発生したぽいで`
        )
      );
      return;
    }

    if (error instanceof UnauthorizedException) {
      await reaction.message.reply(
        buildNoMentionReply(`${reaction.emoji} < twitter の認証で死んだんだわ`)
      );
      return;
    }

    if (error instanceof ServerErrorException) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < Twitter のサービスが死んでるかもしれん`
        )
      );
      return;
    }

    if (error instanceof Error) {
      await reaction.message.reply(
        buildNoMentionReply(`${reaction.emoji} < なんか知らんエラーが出たわ`)
      );
      const errorMessage = '```\n' + `${error.message}\n` + '```';
      await reaction.message.channel.send(errorMessage);
      return;
    }
  }
};

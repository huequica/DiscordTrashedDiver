import { buildNoMentionReply } from '@/actions/utils/buildNoMentionReply';
import { inspectContents } from '@/actions/utils/leakMessage/inspectContents';
import { shouldRunLeak } from '@/actions/utils/leakMessage/shouldRunLeak';
import { pickAttachments } from '@/actions/utils/pickAttachments';
import { pickEmoji } from '@/actions/utils/pickEmoji';
import {
  ContentsTooLongException,
  EmojiNotFoundError,
  NetworkHandshakeException,
  ServerErrorException,
  UnauthorizedException,
} from '@/lib/exceptions';
import { Logger } from '@/lib/services/logger';
import { TwitterService } from '@/lib/services/twitter';
import { isTextChannel } from '@/typeGuards/isTextChannel';
import { MessageReaction } from 'discord.js';

interface Services {
  twitter: TwitterService;
}

export const leakMessage = async (
  reaction: MessageReaction,
  services?: Services,
) => {
  // 原則として来ることはないがコンパイラを黙らせる意味で書いている
  const channel = reaction.message.channel;
  if (!isTextChannel(channel)) return;

  const filters: Parameters<typeof shouldRunLeak>[0] = {
    channelName: channel.name,
    emojiName: reaction.emoji.name || '',
    isAuthorBot: reaction.message.author?.bot || false,
  };

  if (!shouldRunLeak(filters)) return;

  Logger.debug('Start Leak Message...');

  try {
    const twitterService = services?.twitter || new TwitterService();
    const messageContent = inspectContents(reaction.message.content ?? '');

    // 4つまでファイルの情報を絞ってから更に contentType が `image/*` の物だけ取得
    const imageAttachments = pickAttachments(reaction).filter((attachment) =>
      /image\/.*/.test(attachment.contentType),
    );

    if (!messageContent && imageAttachments.length === 0) return;

    // 画像ファイルが1つ以上ある場合だけ Promise を生成、なければ undefined を返却
    const mediaIdPromises: Promise<string>[] | undefined =
      imageAttachments.length > 0
        ? imageAttachments.map((image) => twitterService.uploadMedia(image.url))
        : undefined;

    const mediaIds: string[] | undefined = mediaIdPromises
      ? await Promise.all(mediaIdPromises)
      : undefined;

    const tweetResultURL = await twitterService.postTweet(
      messageContent,
      mediaIds,
    );

    const emoji = pickEmoji(reaction.client, 'watching_you2');

    const replyOptions = buildNoMentionReply(`${emoji} ${tweetResultURL}`);
    await reaction.message.reply(replyOptions);

    Logger.debug('Succeed leak message.');
  } catch (error: unknown) {
    Logger.debug('ERROR OCCURRED IN LEAK MESSAGE!', error);

    if (error instanceof ContentsTooLongException) {
      await reaction.message.reply(
        buildNoMentionReply(`${reaction.emoji} < この投稿長すぎなんだわ`),
      );
      return;
    }

    if (error instanceof EmojiNotFoundError) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < わりい、使おうとしたやつがないんだわ`,
        ),
      );
      return;
    }

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
        buildNoMentionReply(`${reaction.emoji} < twitter の認証で死んだんだわ`),
      );
      return;
    }

    if (error instanceof ServerErrorException) {
      await reaction.message.reply(
        buildNoMentionReply(
          `${reaction.emoji} < Twitter のサービスが死んでるかもしれん`,
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
  } finally {
    // ついた絵文字が消される
    await reaction.remove();
  }
};

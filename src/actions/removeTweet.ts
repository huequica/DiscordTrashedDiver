import { MessageReaction, User } from 'discord.js';
import { TwitterService } from '@/lib/services/twitter';
import { shouldRemoveTweet } from '@/actions/utils/removeTweet/shouldRemoveTweet';

interface Services {
  twitter: TwitterService;
}

export const removeTweet = async (
  reaction: MessageReaction,
  reactorUser: User,
  services?: Services
) => {
  const filter: Parameters<typeof shouldRemoveTweet>[0] = {
    emojiName: reaction.emoji.name || '',
    isReactedMessageAuthorBot: reaction.message.author?.bot || false,
    reactorId: reactorUser.id,
    referencedMessageAuthorId: (await reaction.message.fetchReference()).author
      .id,
  };

  if(!shouldRemoveTweet(filter)) return;
};

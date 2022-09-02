import { Collection, GuildEmoji, MessageReaction } from 'discord.js';

const mockGuildEmojis = (omitExpectEmoji: boolean): GuildEmoji[] => {
  const objects = new Array(3).map(
    (_, index) =>
      ({
        name: `mockEmoji_${index}}`,
        toString: () => `:mockEmoji_${index}:`,
      } as GuildEmoji)
  );

  // true なら正常例の絵文字オブジェクトも追加
  if (!omitExpectEmoji)
    objects.push({
      name: 'boomerang',
      toString: () => ':boomerang:',
    } as GuildEmoji);

  return objects;
};

interface MockMessageReactionOptions {
  message: {
    content?: string;
    referenceUserId?: string;
    author?: {
      bot?: boolean;
    };
  };
  channel: {
    name?: string;
    type?: string;
  };
  emoji: {
    name?: string;
    omitExpectEmoji?: boolean;
  };
}

export type GenerateMockMessageReactionOptions =
  Partial<MockMessageReactionOptions>;

export const generateMockMessageReaction = (
  options?: GenerateMockMessageReactionOptions
): MessageReaction => {
  const role = {
    members: {
      get: () => ({}),
    },
  };

  return {
    message: {
      content: options?.message?.content || 'mockMessage!',
      author: {
        bot: options?.message?.author || false,
      },
      attachments: new Collection(),
      channel: {
        type: options?.channel?.type || 'GUILD_TEXT',
        name: options?.channel?.name || 'ごみばこ',
        send: jest.fn().mockImplementation(),
      },
      reply: jest.fn().mockImplementation(),

      // リプ元の参照
      reference: [],
      fetchReference: () =>
        Promise.resolve({
          author: { id: options?.message?.referenceUserId || 'hogeUser' },
        }),
      guild: {
        roles: {
          cache: {
            get: () => role,
          },
        },
      },
    },
    emoji: {
      name: options?.emoji?.name || 'thinking_mikan',
      // モックで適当に toString をオーバーライドして返却値を設定
      toString() {
        return `:${this.name}:`;
      },
    },
    client: {
      emojis: {
        cache: mockGuildEmojis(options?.emoji?.omitExpectEmoji || false),
      },
    },
    remove: jest.fn(),
  } as unknown as MessageReaction;
};

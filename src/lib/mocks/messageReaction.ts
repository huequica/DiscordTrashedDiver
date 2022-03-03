import { MessageReaction } from 'discord.js';

interface MockMessageReactionOptions {
  channel: {
    name?: string;
    type?: string;
  };
  emoji: {
    name?: string;
  };
}

export type GenerateMockMessageReactionOptions =
  Partial<MockMessageReactionOptions>;

export const generateMockMessageReaction = (
  options?: GenerateMockMessageReactionOptions
): MessageReaction => {
  return {
    message: {
      channel: {
        type: options?.channel?.type || 'GUILD_TEXT',
        name: options?.channel?.name || 'ごみばこ',
      },
      reply: jest.fn(),
    },
    emoji: {
      name: options?.emoji?.name || 'troll_face',
      // モックで適当に toString をオーバーライドして返却値を設定
      toString() {
        return `:${this.name}:`;
      },
    },
  } as unknown as MessageReaction;
};

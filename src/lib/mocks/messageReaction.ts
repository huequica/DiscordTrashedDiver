import { MessageReaction } from 'discord.js';

export const generateMockMessageReaction = (): MessageReaction => {
  return {
    message: {
      channel: {
        type: 'GUILD_TEXT',
        name: 'ごみばこ',
      },
      reply: jest.fn(),
    },
    emoji: {
      name: 'troll_face',
      // モックで適当に toString をオーバーライドして返却値を設定
      toString() {
        return `:${this.name}:`;
      },
    },
  } as unknown as MessageReaction;
};

import { leakMessage } from '@/actions/leakMessage';
import {
  generateMockMessageReaction,
  GenerateMockMessageReactionOptions,
} from '@/lib/mocks/messageReaction';

describe('🚓 leakMessage', () => {
  it('👮 フィルターを通った場合は reaction.reply.message が発火する', () => {
    const reactionMock = generateMockMessageReaction();

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).toHaveBeenCalledWith(':troll_face:');
  });

  it('👮 フィルターを通らない場合は void で早期リターンする', () => {
    const mockReactionOptions: GenerateMockMessageReactionOptions = {
      channel: {
        name: 'general',
      },
      emoji: {
        name: 'troll_face',
      },
    };

    const reactionMock = generateMockMessageReaction(mockReactionOptions);

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).not.toHaveBeenCalled();
  });
});

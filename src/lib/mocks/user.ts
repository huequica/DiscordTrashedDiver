import { User } from 'discord.js';

interface MockUserOption {
  id: string;
}

export const generateMockUser = (options?: MockUserOption): User => {
  return {
    id: options?.id || 'hogeUser',
  } as unknown as User;
};

import { IS_DEBUG_MODE } from '@/config/env';

export class Logger {
  static debug(message: string, ...val: unknown[]) {
    IS_DEBUG_MODE() && console.log(`[DEBUG]${message}: `, ...val);
  }
}

import { ContentsTooLongException } from '@/lib/exceptions';

/**
 * 字数を検証しつつメッセージの中身を渡す
 * @param target
 * @return メッセージの内容
 * @throws ContentsTooLongException 文字数が 140 を超えている場合に throw される
 */
export const inspectContents = (target: string): string => {
  if (target.length > 140) throw new ContentsTooLongException();
  return target;
};

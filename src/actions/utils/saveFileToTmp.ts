import path from 'path';
import { APPLICATION_TMP_DIRECTORY } from '@/config/env';
import axios from 'axios';
import makeDir from 'make-dir';
import fs from 'fs/promises';

/**
 * URL 先のコンテンツ情報をファイルに保存する
 * @param url 保存する情報のURL
 * @return {Promise<string>} 保存したファイルパス
 */
export const saveToTmpFile = async (url: string): Promise<string> => {
  const fileName = path.basename(url);
  const tmpDirectory = `${APPLICATION_TMP_DIRECTORY}/leakMessage`;

  try {
    const content = await axios
      .get<ArrayBuffer>(url, { responseType: 'arraybuffer' })
      .then((res) => res.data);
    await makeDir(tmpDirectory);

    // どうにも自分の知見ではつらそうだった, ゆるしてほしい
    await fs.writeFile(
      `${tmpDirectory}/${fileName}`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Buffer.from(content),
      'binary',
    );

    return `${tmpDirectory}/${fileName}`;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('ファイルの保存にエラーが発生しました');
    }
    throw error;
  }
};

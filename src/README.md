# for developers

このリポジトリのディレクトリ責務について掲載します。PR を出される方は参考にしてください。

# directory, file の責務

## index.ts

いわゆるエントリーポイントです。この段階で API を叩かない範疇で Key 情報に問題がないかエラーチェックをしています。

## events.ts

イベントを追加していく空間です。  
イベント未登録の `Client` を引数として受け取り、イベントを登録してそのまま `main()` の空間に返却する使用方法を想定しています。

```ts
export const subscribeEvents = (client: Client): Client => {
  client.once('ready', () => {
    console.log('start discord bot service!');
  });

  client.on('messageReactionAdd', (reaction) => {
    if (!(reaction instanceof MessageReaction)) return;
    leakMessage(reaction); // @/actions から import した動作を書く
  });

  return client;
};
```

## @/actions

このディレクトリ配下の関数が「〜〜〜されたときに〜〜〜をする」といったようなビジネスロジックを持ちます。  
この生成した関数を `export` し、 `events.ts` で `import` することによって動かしています。

**このビジネスロジックの中では例外処理を厚めにしてください。**  
また、このビジネスロジックには jest でテストを書いておくことを強くおすすめします。

### @/actions/utils

ビジネスロジックを作っていく上で分離したい関数などを置いていく場所としています。  
ドメイン実装にグローバルで使われそうなメソッドを `@/actions/utils` の直下に置きます。  
逆に単一のドメインのための実装に使うことが予想される場合は更に下にアクション名のディレクトリを作り、その下で書いてください。

## @/config

`.env` から得た認証情報や動かすための [`Intents`](https://scrapbox.io/discordjs-japan/Gateway_Intents_%E3%81%AE%E5%88%A9%E7%94%A8%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E3%82%AC%E3%82%A4%E3%83%89) を保管しています。  
`.env` から認証情報を得る場合は**必ず関数に閉じ込め、 `undefined` が返される場合はエラーを throw してください。**

Intents についての詳細は以下を参照してください。  
https://scrapbox.io/discordjs-japan/Gateway_Intents_%E3%81%AE%E5%88%A9%E7%94%A8%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E3%82%AC%E3%82%A4%E3%83%89

## @/lib

いろいろ入っています。以下記述に詳細を残します。

### @/lib/repositories

外部の API を叩いたりする際のリクエストメソッドの最小単位です。  
原則ここではクラスを作りその中のメソッドで `Promise` をそのまま帰すようにしてください。( 以下サンプルでの `postTweet` )

```ts
// @/lib/repositories/twitter.ts

/**
 * Twitter への投稿を管轄する repository
 */
export class TwitterRepository {
  private client: Twitter;

  constructor(keys: ReturnType<typeof TWITTER_TOKENS>) {
    this.client = new Twitter({
      appKey: keys.consumer.key,
      appSecret: keys.consumer.secret,
      accessToken: keys.account.key,
      accessSecret: keys.account.secret,
    });
  }

  /**
   * テキストをツイートする
   * WIP: 画像などのメディアを添付する(repository 設計もまだ)
   * @param content ツイート文面
   */
  async postTweet(content: string) {
    return this.client.v1.tweet(content);
  }
}
```

### @/lib/service

上記 repositories の返却値を加工した返却値を作成したり, 独自例外を投げるための空間です。留意事項は以下の通りです。

- constructor の引数として上記の repository のインスタンスを **optional** で取ってください。
  - メソッドをオーバーライドした `repository` をテストコード上で渡すことで返却値や throw されるエラーにテストをすることができるようになるためです。
- 原則受け取ることが予想される例外は `try{}catch{}` で拾った上で種類ごとに独自の例外クラスを throw してください。
  - ドメインロジック上の `try{}catch{}` で `instanceof` を使用してエラーの種類を判別可能にし、可読性も維持できるためです。
- `try` の中で Promise を返却するコードを書きますが `return await` としてください。
  - 非同期が解決されたタイミングでのエラーを catch するためです。

```ts
// @/lib/services/twitter.ts

export class TwitterService {
  private repository: TwitterRepository;

  constructor(repository?: TwitterRepository) {
    this.repository = repository || new TwitterRepository(TWITTER_TOKENS());
  }

  /**
   * twitter へ文面を投稿する
   * @param content ツイート文面
   * @return {Promise<string>} ツイートのリンク
   */
  async postTweet(content: string): Promise<string> {
    try {
      return await this.repository
        .postTweet(content)
        .then(
          (res) =>
            `https://twitter.com/${res.user.screen_name}/status/${res.id_str}`
        );
    } catch (error: unknown) {
      // シンプルに疎通ができなかったなどのエラー
      if (error instanceof ApiRequestError) {
        throw new NetworkHandshakeException();
      }

      // twitter から エラーのレスポンスが返却されたなどのエラー
      if (error instanceof ApiResponseError) {
        switch (error.code) {
          case 401:
            throw new UnauthorizedException();
          case 500:
            throw new ServerErrorException();
        }
      }
      throw error;
    }
  }
}
```

### @/lib/exceptions

service などで throw する独自例外クラスを格納する空間です。  
上述していますが、ドメインロジック上で `instanceof` を使用してエラーの種類を特定可能にしているためです。  
基本的には以下コードをそのまま命名変えれば OK です。

```ts
// @/lib/exceptions/unauthorized.ts

/**
 * 認証でコケた場合の例外クラス
 */
export class UnauthorizedException extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}
```

### @/lib/mocks

jest でテストコードを書く際のモックデータを格納する空間です。  
特に言うことはないです。何なら割と適当です。

## @/typeGuards

型ガード関数を書くための空間です。  
`instanceof` で判別可能なものがほとんどですが、モック化が死ぬほど大変になるのでそれっぽくやってます。  

```ts
// @/typeGuards/isTextChannel.ts

/**
 * `channel instanceof TextChannel` の wrapper
 * @param channel 正体不明のチャンネルオブジェクト. `reaction.message.channel` から取る
 */
export const isTextChannel = (
  channel: ReturnType<typeof getChannelFromReaction>
): channel is TextChannel => channel.type === 'GUILD_TEXT';
```

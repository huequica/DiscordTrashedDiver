# DiscordTrashedDiver

身内向け Discord bot

# feature

- 「ごみばこ」というチャンネルで発言されたものに `:troll_face:` の絵文字でリアクションをつけると twitter に投下される  
  ![Screen Shot 2022-03-06 at 4 40 29](https://user-images.githubusercontent.com/40014236/156897828-a1b5bbce-bebd-4fa0-a23a-3c8c5e6c1e66.png)

# require environment

- node
  - v16.13.0
  - `nodenv` を使用して管理している場合は自動で設定されます( `.nodenv` がそれを管理している)
- yarn
  - `v1.22.17` にて開発

# get started

1. `$ git clone https://github.com/huequica/DiscordTrashedDiver.git`
2. `yarn` で依存を落としてくる
3. `yarn build` で ビルドしたファイルが出来る
4. `.env.template` をコピペして `.env` を作り、各種情報を追記する
5. `node dist/index.js` で実行

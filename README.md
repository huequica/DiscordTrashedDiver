# DiscordTrashedDiver

身内向け Discord bot

# feature

- 「ごみばこ」というチャンネルで発言されたものに `:thinking_mikan:` の絵文字でリアクションをつけると twitter に投下される  
  ![Screen Shot 2022-03-06 at 4 40 29](https://user-images.githubusercontent.com/40014236/156897828-a1b5bbce-bebd-4fa0-a23a-3c8c5e6c1e66.png)

# require environment

- node
  - v18.20.2s
- pnpm
  - 9.0.4

# get started

1. `$ git clone https://github.com/huequica/DiscordTrashedDiver.git`
2. `pnpm i --frozen-lockfile` で依存を落としてくる
3. `pnpm build` で ビルドしたファイルが出来る
4. `.env.template` をコピペして `.env` を作り、各種情報を追記する
5. `pnpm start` で実行

# running at systemd

たぶんこれを `/etc/systemd/system/discord-trashed-diver.service` に作成すればいいんじゃないですかね

```
[Unit]
Description=https://github.com/huequica/DiscordTrashedDiver
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/bin/bash -c "pnpm start"
ExecStop=/bin/bash -c "kill $(systemctl show --property MainPID --value discord-trashed-diver)"
WorkingDirectory=/root/DiscordTrashedDiver
Restart=always
Type=simple

[Install]
WantedBy=multi-user.target
```

INSERT
  INTO `menu` (`id`, `url`, `title`, `description`)
  VALUES (1, '/links','リンク集', 'よくアクセスするサイトや、授業で使えるサイトへのリンクをまとめました。(ガルーン、GDLS, ちびむす, 大学入試過去問, MugenPなど)')
  ON DUPLICATE KEY UPDATE
    url = '/links',
    title = 'リンク集',
    description = 'よくアクセスするサイトや、授業で使えるサイトへのリンクをまとめました。(ガルーン、GDLS, ちびむす, 大学入試過去問, MugenPなど)'
;

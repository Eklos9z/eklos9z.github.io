/* global hexo */

'use strict';

// 「更新于」取该文件在 git 里的最后一次提交时间。
//
// 为什么不用 updated_option: 'mtime'：
// CI 上 actions/checkout 是全新克隆，所有文件的 mtime 都等于克隆时刻，
// 于是每次部署全部文章都会显示同一个当天日期。用 git 提交时间则逐篇独立，
// 改了哪篇提交后就只有哪篇的日期会变。
//
// 与 _config.yml 的配合：updated_option 必须设为 'empty'。
// Hexo 的处理顺序是「front-matter 的 updated 优先，其次才看 updated_option」，
// 设为 'empty' 后没写 updated 的文章 data.updated 才为空，由本脚本补上；
// 写了 updated 的文章保持原值，不会被覆盖。

const { execSync } = require('child_process');

const cache = new Map();

function gitCommitTime(file) {
  if (cache.has(file)) return cache.get(file);

  let result = null;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${file}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();

    if (out) {
      const date = new Date(out);
      if (!Number.isNaN(date.getTime())) result = date;
    }
  } catch (err) {
    // 不在 git 仓库中（或没有 git），保持原值，不阻断构建
  }

  cache.set(file, result);
  return result;
}

hexo.extend.filter.register('before_post_render', data => {
  if (!data.source) return data;
  // front-matter 里显式写了 updated 的文章优先，不覆盖
  if (data.updated) return data;

  const time = gitCommitTime(`source/${data.source}`);
  if (time) data.updated = time;

  return data;
});

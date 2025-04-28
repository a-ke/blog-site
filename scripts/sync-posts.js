// sync-posts.mjs (或 .js + type="module")
import { execSync } from 'child_process';
import { rm, cp } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';


async function copyFiles(sourceDir, destDir) { 
  await fse.copy(sourceDir, destDir, { 
      filter: (src) => !path.basename(src).startsWith('.') 
  });
}

async function syncPosts() {
  // 同步文章
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const TMP_DIR = path.join(__dirname, '..', 'tmp-posts');
  const POSTS_DIR = path.join(__dirname, '..', 'src/content/posts');

  await rm(TMP_DIR, { recursive: true, force: true });

  // 克隆/更新Git仓库并同步文章
  try {
    execSync(`git clone --depth=1 https://github.com/a-ke/blog-posts.git ${TMP_DIR}`);

    await copyFiles(`${TMP_DIR}`, POSTS_DIR);
    
    console.log('✅ Articles synced!');
  } catch (error) {
    console.error('❌ Error syncing articles:', error);
  } finally {
    await rm(TMP_DIR, { recursive: true, force: true });
  }
}

await syncPosts();

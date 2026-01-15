/// <reference types="bun" />
import packageJson from '../packages/core/package.json' assert { type: "json" };

const version = packageJson.version;
const tag = `v${version}`;
console.log('tag', tag);
const commit = `chore(release): version packages`;

const result = await Bun.spawn(['git', 'tag', tag, '-m', commit]);
const exitCode = await result.exited;

if (exitCode !== 0) {
  throw new Error('Failed to tag');
}

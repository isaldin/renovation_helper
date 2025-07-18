const { copyFileSync } = require('fs');
const { resolve } = require('path');

module.exports = {
  entryPoints: ['bot/src/main.ts'],
  outdir: 'bot/dist',
  outbase: 'bot/src',
  sourcemap: true,
  outExtension: { '.js': '.js' },
  plugins: [
    {
      name: 'copy-assets',
      setup(build) {
        console.log('Copying serviceAccountKey.json to dist/bot');
        build.onEnd(() => {
          copyFileSync(
            resolve(__dirname, '../serviceAccountKey.json'),
            resolve(__dirname, './dist/bot/serviceAccountKey.json')
          );
          console.log('Copied config.json');
        });
      },
    },
  ],
};

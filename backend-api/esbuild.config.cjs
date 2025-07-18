const { copyFileSync } = require('fs');
const { resolve } = require('path');

module.exports = {
  entryPoints: ['backend-api/src/main.ts'],
  outdir: 'backend-api/dist',
  outbase: 'backend-api/src',
  sourcemap: true,
  outExtension: { '.js': '.js' },
  plugins: [
    {
      name: 'copy-assets',
      setup(build) {
        console.log('Copying serviceAccountKey.json to dist/backend-api');
        build.onEnd(() => {
          copyFileSync(
            resolve(__dirname, '../serviceAccountKey.json'),
            resolve(__dirname, './dist/backend-api/serviceAccountKey.json')
          );
          console.log('Copied config.json');
        });
      },
    },
  ],
};

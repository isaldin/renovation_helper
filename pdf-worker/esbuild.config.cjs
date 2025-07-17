const { copyFileSync } = require('fs');
const { resolve } = require('path');

module.exports = {
  entryPoints: ['pdf-worker/src/main.ts'],
  outdir: 'pdf-worker/dist',
  outbase: 'pdf-worker/src',
  sourcemap: true,
  outExtension: { '.js': '.js' },
  plugins: [
    {
      name: 'copy-assets',
      setup(build) {
        console.log('Copying serviceAccountKey.json to dist/pdf-worker');
        build.onEnd(() => {
          copyFileSync(
            resolve(__dirname, 'serviceAccountKey.json'),
            resolve(__dirname, './dist/pdf-worker/serviceAccountKey.json')
          );
          console.log('Copied config.json');
        });
      },
    },
  ],
};

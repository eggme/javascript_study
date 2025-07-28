const { batch } = require("watchpack/lib/watchEventSource");
const { RawSource } = require("webpack-sources");

class MyWebpackPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('MyWebpackPlugin', (compilation) => { // 플러그인이 완료 됐을 때, 동작하는 콜백 함수, 플러그인이 종료 됐을 떄 실행되는 녀석
            console.log('MyPlugin: done');

            const { Compilation } = compiler.webpack;

            compilation.hooks.processAssets.tap({
                name: 'MyWebpackPlugin',
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
            }, (assets) => {
                const assetName = 'main.js'
                const asset = compilation.getAsset(assetName);
                if( asset ) {
                    const banner = [
                        '/**',
                        '  * 이것은 BannerPlugin 이 처리한 결과입니다.',
                        '  * Build Date: 2025-07-25',
                        '**/',
                    ].join('\n');
                    const newSource = banner + '\n\n'+asset.source.source();
                    compilation.updateAsset(
                        assetName,
                        new RawSource(newSource)
                    )
                }
            });
        });
    }
} // 로더가 여러 개 파일에 있는 것을 각각 실행했다면, 플러그인은 여러개의 파일을 묶어 놓은 번들에 대해 딱 한번 실행함
// 어떻게 번들 결과에 접근할 수 있을까?

module.exports = MyWebpackPlugin;
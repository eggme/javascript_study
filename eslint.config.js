import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ recommendedConfig: true });

export default [
    ...compat.extends("eslint:recommended"),
    {
        files: ["*.js"],
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"]
        }
    }
];

// module.exports = {
    // extends : [ // ESLint 9 에서는 .eslintrc.js 처럼 직접 쓸 수 없다고 함
    //     "eslint:recommended"
    // ],
    // rules: {
    //     "no-unexpected-multiline": "error",
    //     "no-extra-semi": "error",
    // }
// }

// ESLint 9버전 부터는  기본 설정 파일이 바뀜
// 기존에는 eslint.config.cjs, .eslintrc.json, .eslintrc.yaml 등을 사용했지만
// ESLint 9부터는 기본 설정 파일이 **eslint.config.cjs**로 바뀌었고, 이전 .eslintrc.*는 “레거시 모드”로 동작해야 합니다.


// 새 포멧으로 하거나, npm install --save-dev @eslint/eslintrc 설치 필요, 혹은 npx eslint --legacy-config ./src/test.js
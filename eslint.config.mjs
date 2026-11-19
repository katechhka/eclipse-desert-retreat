import next from 'eslint-config-next/core-web-vitals';
const config = [...next, {ignores:['.next/**','.npm-cache/**','out/**','artifacts/**']}];
export default config;

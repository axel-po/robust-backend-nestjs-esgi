import { execSync } from 'child_process';
import path from 'path';

const sdkPath = require.resolve('@nestia/sdk/lib/executable/sdk.js');
execSync(`node ${sdkPath} swagger`, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
});

#!/usr/bin/env node
const { spawn } = require('child_process');

const port = process.env.PORT || process.env.npm_config_port || '5173';
const args = ['dev', '--host', '0.0.0.0', '--port', String(port)];

const proc = spawn('npx', ['vite', ...args], { stdio: 'inherit' });

proc.on('exit', code => process.exit(code));
proc.on('error', err => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

['SIGINT','SIGTERM','SIGHUP'].forEach(sig => {
  process.on(sig, () => { proc.kill(sig); });
});

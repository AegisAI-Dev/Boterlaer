const path = require('path');

module.exports = {
  apps: [{
    name: 'botanische-den-boterlaer',
    script: 'node',
    args: './node_modules/next/dist/bin/next start',
    cwd: __dirname, // Gebruik directory waar config bestand staat
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,  // Luister op poort 3000, Nginx forward poort 80
      HOSTNAME: '0.0.0.0',
      USE_HTTPS: 'false',  // Expliciet aangeven dat we HTTP gebruiken
      PRISMA_CLIENT_ENGINE_TYPE: 'binary'
    },
    error_file: path.join(__dirname, 'logs', 'pm2-error.log'),
    out_file: path.join(__dirname, 'logs', 'pm2-out.log'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};

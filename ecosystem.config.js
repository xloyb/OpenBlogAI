module.exports = {
  apps: [{
    name: 'openblogai-server',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: process.env.DATABASE_URL,
    },
    error_file: '/var/log/openblogai/err.log',
    out_file: '/var/log/openblogai/out.log',
    merge_logs: true,
    time: true
  }]
};

module.exports = {
  apps: [
    {
      name: 'client',
      cwd: './client',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false
    },
    {
      name: 'server',
      cwd: './server',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: false
    }
  ]
};

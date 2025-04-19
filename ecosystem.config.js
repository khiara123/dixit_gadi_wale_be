module.exports = {
  apps: [
    {
      name: "employee_management",
      script: "./bin/www",
      exp_backoff_restart_delay: 100,
      max_memory_restart: "1G",
      max_restarts: 10,
      min_uptime: 2000,
      out_file: './emp_mgt.log',
      error_file: './emp_mgt_error.log',
      /**
     instances: -1,
     exec_mode : 'cluster',
     watch: ['../'],
     watch_delay: 1000,
     ignore_watch: ['node_modules'],
     watch_options: {
        followSymlinks: false,
      },
       */
     
      /**
       * By default, if the ready signal isn't received, 
       * PM2 will wait for three seconds before designating your application as online. 
       * If you wish to adjust this duration,
       * you can use the --listen-timeout flag followed by the desired timeout in milliseconds:
       */
      wait_ready: true,
      listen_timeout: 10000,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};

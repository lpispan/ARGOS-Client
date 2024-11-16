const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/static/index.html',
      filename: 'index.html'
    }),
    new Dotenv({
      path: './config/custom.env',
    }),
  ],
  watchOptions: { aggregateTimeout: 3000 },
  snapshot: { managedPaths: [] },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    // hot: true,
    // open: true,
    // proxy: {
    //   '/argos-client': {
    //     target: 'http://localhost:3000', // Aquí corre tu backend Nodemon
    //     secure: false
    //   }
    // },
    // port: 9000,
    host: '0.0.0.0',  // Escuchar en todas las interfaces de red
    port: 9000,       // Asegúrate de que el puerto esté disponible
    allowedHosts: ['localhost', 'KIS-000', 'vagrant-2008R2', '192.168.0.20'],
    hot: true,        // Habilitar Hot Module Replacement si lo usas
    headers: {
      'Access-Control-Allow-Origin': '*', // Permitir CORS si es necesario
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Métodos permitidos
      'Access-Control-Allow-Headers': '*'  // Permitir ciertos encabezados
    },
    proxy: {
      '/argos-client': {
        target: 'http://localhost:3000', // Aquí corre tu backend Nodemon
        secure: false
      }
    },
  }
};

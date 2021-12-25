const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
}, {
  test: /\.(png|jpg|gif|mp3|svg|woff|eot|ttf)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        limit: 5000
      }
    }
  ]
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.mp3']
  },
};

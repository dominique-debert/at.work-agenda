var path = require('path');
var webpack = require('webpack');

var JS_PUBLIC = '/o/agiir.agenda-1.0.0/js/dist/';

var JS_SRC = path.resolve(__dirname, 'src/main/resources/META-INF/resources/js/src/');

module.exports = {
	devServer: {
		hot: true,
		port: 3000,
		proxy: {
			'**': 'http://0.0.0.0:8080'
		},
		publicPath: JS_PUBLIC
	},
	entry: [
		'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
		path.resolve(JS_SRC, 'index.js') // Your appʼs entry point
  ],
  resolve: {
    extensions: ['.js']
  },
	module: {
    rules: [
		{
			test: /\.css$/,
			loader: "style-loader!css-loader"
		},
		{
			test: /.(png|jpg|woff|woff2|eot|ttf|svg|gif)$/,
			loader: 'url-loader?limit=1024000' 
		},
		{
			include: [JS_SRC],
			loader: ['react-hot-loader/webpack']
		},
		{
			include: [JS_SRC],
			loader: 'babel-loader'
		},
      {
        include: [JS_SRC],
        loader: 'babel-loader'
      },
    ]
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, 'src/main/resources/META-INF/resources/js/dist'),
		publicPath: JS_PUBLIC
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	mode: "development",
};
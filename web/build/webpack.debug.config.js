"use strict";

const webpack = require('webpack');
const path = require('path');

module.exports = {
	devtool: 'inline-sourcemap',
	entry: path.join(__dirname, '..', 'app', 'client.js'),
	devServer: {
		inline: true,
		port: 3333,
		contentBase: path.join(__dirname, '..', 'static'),
		historyApiFallback: {
			index: '/index-static.html'
		}
	},
	output: {
		path: path.join(__dirname, '..', 'static', 'js'),
		publicPath: "/js/",
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: path.join(__dirname, '..', 'app'),
			loader: ['babel-loader'],
			query: {
				cacheDirectory: './temp/babel_cache',
				presets: ['react', 'es2015']
			}
		}]
	},
	plugins:[] 
};

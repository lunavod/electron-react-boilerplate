const path = require('path')
const webpack = require('webpack')

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove 'splitChunks' from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
	mode: 'development',
	entry: {
		rhmr: 'react-hot-loader/patch',
		index: './src/index.js'
	},

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},

	plugins: [
		new webpack.ProgressPlugin(), new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: false
		}),
		new webpack.ProvidePlugin({
			'React': 'react',
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: '[name].css',
			chunkFilename: '[id].css',
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		})
	],

	target: 'electron-renderer',

	module: {
		rules: [{
			test: /.(js|jsx)$/,
			include: [path.resolve(__dirname, 'src')],
			loader: 'babel-loader',

			options: {
				plugins: ['syntax-dynamic-import', 'react-hot-loader/babel', '@babel/plugin-proposal-class-properties'],

				presets: [
					'@babel/react',
				]
			}
		},
		{
			test: /\.css$/,
			loaders: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						hmr: true,
					},
				},
				// 'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: {
							localIdentName: '[path][name]__[local]--[hash:base64:5]',
						},
					}
				}
			]
		},
		{
			test: /\.node$/,
			use: 'node-loader'
		},
		]
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},

	devServer: {
		contentBase: './dist',
		port: 8080,
		hot: true,
	},

	resolve: {
		alias: {
			'react-dom': '@hot-loader/react-dom',
			'Utils': path.resolve(__dirname, 'src/utils'),
			'Services': path.resolve(__dirname, 'src/services'),
			'Components': path.resolve(__dirname, 'src/components')
		},
	},
	node: {
		__dirname: true
	},
	externals: {
		'active-win': 'activeWin',
		// 'ref-napi': 'ref-napi',
		// 'ffi-napi': 'ffi-napi'
	}
}
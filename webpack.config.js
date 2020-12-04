const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const PrettierPlugin = require("prettier-webpack-plugin");
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = (env, argv) => {

	const isDev = argv.mode === 'development'
	const isProd = argv.mode === 'production'

	const optimization = () => {
		const config = {
			splitChunks: {
				chunks: 'all'
			}
		}

		if (isProd) {
			config.minimizer = [
				new OptimizeCssAssetWebpackPlugin(),
				new TerserWebpackPlugin()
			]
		}

		return config
	}

	const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

	return {
		context: path.resolve(__dirname, 'src'),
		mode: 'development',
		entry: {
			main: './index.js'
		},
		output: {
			filename: filename('js'),
			path: path.resolve(__dirname, 'dist')
		},
		resolve: {
			extensions: ['.js', '.json'],
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		},
		optimization: optimization(),
		devServer: {
			port: 4212,
			open: true,
			hot: true
		},
		plugins: [
			new CleanWebpackPlugin(),
			new PrettierPlugin(),
			new HTMLWebpackPlugin({
				template: path.resolve(__dirname, 'src/template/index.pug'),
				filename: path.resolve(__dirname, 'dist/index.html'),
			}),
			new HTMLWebpackPlugin({
				template: './template/pages/createschool.pug',
				filename: path.resolve(__dirname, 'dist/pages/createschool.html'),
			}),
			new HTMLWebpackPlugin({
				template: './template/pages/course.pug',
				filename: path.resolve(__dirname, 'dist/pages/course.html'),
			}),
			// new CopyWebpackPlugin({
			// 	patterns: [
			// 		{
			// 			from: './assets/img',
			// 			to: path.resolve(__dirname, 'dist/imgages')
			// 		}
			// 	]
			// }),
			// new CopyWebpackPlugin({
			// 	patterns: [
			// 		{
			// 			from: './assets/fonts',
			// 			to: path.resolve(__dirname, 'dist/fonts')
			// 		}
			// 	]
			// }),
			new MiniCssExtractPlugin({
				filename: filename('css')
			}),
			// new SVGSpritemapPlugin()
		],
		module: {
			rules: [
			    {
			    	test: /\.scss$/i,
			    	use: [
		           		isDev ? {
		            		loader: "style-loader",
			            }
			            :
			            {
			                loader: MiniCssExtractPlugin.loader,
			                options: {
			                    publicPath: "../dist",
			                },
			            },
			            "css-loader",
			            "sass-loader"
		          	],
			    },
				{
					test: /\.(png|jpg|svg|gif)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: isDev ? "images/[name].[hash].[ext]" : "images/[name].[ext]",
							},
						},
					],
				},
				{
					test: /\.(ttf|woff|woff2|eot)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: isDev ? "fonts/[name].[hash].[ext]" : "fonts/[name].[ext]",
							},
						},
					],
				},
				{
					test: /\.pug$/,
					use: [
						'html-loader?minimize=false',
						'pug-html-loader?pretty=true'
					]
					// test: /\.pug$/,
					// loader: 'pug-loader'
				}
			]
		}
	}
}


// const htmlWebpackPlugin = require('html-webpack-plugin');
// //
// // const generateHtmlPlugin = (title) => {
// // 	return new htmlWebpackPlugin({
// // 		title,
// // 		filename: 'index.html',
// // 		template: `./src/pages/${title.toLowerCase()}/index.html`,
// // 	});
// // }
// //
// // const populateHtmlPlugins = (pagesArray) => {
// // 	res = [];
// // 	pagesArray.forEach(page => {
// // 		res.push(generateHtmlPlugin(page));
// // 	})
// // 	return res;
// // }
// //
// // const pages = populateHtmlPlugins(["About", "Articles", "Users", "Contact"]);
// //
// // module.exports = {
// // 	//...
// // 	plugins: pages
// // }
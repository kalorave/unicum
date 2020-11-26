const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

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
			port: 4200,
			open: true,
			hot: isDev
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HTMLWebpackPlugin({
				filename: 'index.html',
				template: './index.html',
				minify: {
					collapseWhitespace: isProd
				}
			}),
			new HTMLWebpackPlugin({
				filename: "pages/index.html",
				template: './pages/about.html',
				minify: {
					collapseWhitespace: isProd
				}
			}),
			// new CopyWebpackPlugin({
			// 	patterns: [
			// 		{
			// 			from: './assets/favicon.ico',
			// 			to: path.resolve(__dirname, 'dist')
			// 		}
			// 	]
			// }),
			new MiniCssExtractPlugin({
				filename: filename('css')
			})
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
			                    publicPath: "../",
			                },
			            },
			            "css-loader",
			            "sass-loader"
		          	],
			    },
				{
					test: /\.(png|jpg|svg|gif)$/,
					use: ['file-loader']
				},
				{
					test: /\.(ttf|woff|woff2|eot)$/,
					use: ['file-loader']
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
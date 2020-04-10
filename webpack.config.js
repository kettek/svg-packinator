const path = require('path')

module.exports = {
	target: 'electron-renderer',
	//mode: 'production',
	mode: 'development',
	entry: './src/renderer/index.js',
	output: {
		path: __dirname,
		// filename: 'build/js/bundle.js',
		filename: 'build/js/bundle.min.js'
	},
	resolve: {
		extensions: ['.js', '.marko'],
//		aliasFields: ["browser"],
		alias: {
			schemata: path.resolve(__dirname, 'src/schemata/'),
			models: path.resolve(__dirname, 'src/models/'),
			views: path.resolve(__dirname, 'src/views/'),
		}
	},
	module: {
		rules: [
			{
				test: /\.marko$/,
				use: 'marko-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
			{
        test: /\.node$/,
        use: 'node-loader'
      }
		]
	}
}

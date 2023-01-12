const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/js/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	resolve: {
		fallback: {
			stream: require.resolve("stream-browserify"),
			buffer: require.resolve("buffer/"),
			timers: require.resolve("timers-browserify"),
		},
	},
	plugins: [new HtmlWebpackPlugin()],
	mode: "development",
};

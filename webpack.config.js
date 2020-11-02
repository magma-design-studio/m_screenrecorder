const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
//const HtmlCriticalPlugin = require("html-critical-webpack-plugin");

//const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
    mode: isDevelopment ? 'development' : 'production',    
    node: {
        fs: "empty"
    },
    entry: {
        bundle: './src/index.js'
    } ,
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    devtool: isDevelopment && "source-map",
    devServer: {
        //host: '192.168.0.108',
        https: true,
        //port: 3333,
        open: true,
        contentBase: path.join(__dirname, "src"),
        disableHostCheck: true,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }        
    },    
    module: {
        rules: [     
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|service\-worker\.js)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          hmr: isDevelopment,
                          reloadAll: isDevelopment,
                        },                        
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            autoprefixer: {
                                browsers: ["last 2 versions"]
                            },
                            sourceMap: isDevelopment,
                            plugins: () => [
                                autoprefixer
                            ]
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },             
            
        ] 
    },
    plugins: [    
        new WorkboxPlugin.GenerateSW(),
        /*
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),   */
       
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'app.css',
            chunkFilename: '[id].css',
        }),    

        new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {}
            }
        }), 

        new HtmlWebpackPlugin()       
        

      ]
  };

if(!isDevelopment) {
    module.exports.devServer = false;    
    
    module.exports.plugins.optimization = { minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})] };    
    
    
    module.exports.plugins = [    
        new WorkboxPlugin.GenerateSW(),   


        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'app.css',
            chunkFilename: '[id].css',
        }),    

        new webpack.LoaderOptionsPlugin({
            options: {
            handlebarsLoader: {}
            }
        }),      


      ];
} else {
}
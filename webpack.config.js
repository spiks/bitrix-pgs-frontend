const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifierPlugin = require('html-beautifier-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'local/templates/main'),
  assets: 'assets',
}

const BUILD_COMPONENTS_STATE = 'default'; 
const BUILD_INCLUDES_STATE = 'default'; 
const PAGES_DIR = path.join(__dirname, 'src/pages');
const COMPONENTS_DIR = path.join(__dirname, 'src/components');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const initMultipleHtmlPlugin = () => {
  const pages = fs.readdirSync(PAGES_DIR);

  const pagesMap = {}

  const pluginInstances = pages.map((page) => {
    const [pageName] = page.split('.');

    if (!pagesMap[pageName]) {
      pagesMap[pageName] = `${pageName}.html`;
    }

    return new HtmlWebpackPlugin({
      filename: `${pageName}.html`,
      template: `${PAGES_DIR}/${page}`,
      minify: false,
    });
  });

  console.log('Pages list:');
  console.log(`${JSON.stringify(pagesMap)}`);

  return pluginInstances;
};

const getComponentsEntryPoints = () => {
  if (BUILD_COMPONENTS_STATE === 'default') return {};

  const componentsDirs = fs.readdirSync(COMPONENTS_DIR);

  const entryPointsMap = {};

  componentsDirs.forEach((componentDir) => {
    const [dirName] = componentDir.split('.');

    const scriptEntryPointName = `${dirName}.scripts`;
    const scriptEntryPointFilePath = path.join(__dirname, `src/components/${dirName}/script.js`);
    
    const styleEntryPointName = `${dirName}.styles`;
    const styleEntryPointFilePath = path.join(__dirname, `src/components/${dirName}/style.js`);

    if (fs.existsSync(scriptEntryPointFilePath) && !entryPointsMap[scriptEntryPointName]) {
      entryPointsMap[scriptEntryPointName] = scriptEntryPointFilePath;
    }

    if (fs.existsSync(styleEntryPointFilePath) && !entryPointsMap[styleEntryPointFilePath]) {
      entryPointsMap[styleEntryPointName] = styleEntryPointFilePath;
    }
  });

  console.log('Components list:');
  console.log(`${JSON.stringify(entryPointsMap)}`);
  return entryPointsMap;
}

const getIncludesEntryPoints = () => {
  if (BUILD_INCLUDES_STATE === 'default') return {};

  return {
    'includes.styles': `${PATHS.src}/includes/includes_styles.js`,
    'includes.scripts': `${PATHS.src}/includes/includes_modules.js`,
  };
};

const config = {
  target: 'browserslist',
  entry: {
    'template.styles': `${PATHS.src}/template/template_styles.js`,
    'template.scripts': `${PATHS.src}/template/template_modules.js`,
    ...getIncludesEntryPoints(),
    ...getComponentsEntryPoints(),
  },
  output: {
    filename: `${PATHS.assets}/js/[name]/[name].js`,
    path: PATHS.dist,
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: PATHS.src,
    },
    open: true,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@': PATHS.src,
      '@template': `${PATHS.src}/template`,
      '@includes': `${PATHS.src}/includes`,
      '@components': `${PATHS.src}/components`,
      '@utils': `${PATHS.src}/utils`,
    }
  },
  plugins: [    
    ...initMultipleHtmlPlugin(),

    new HtmlBeautifierPlugin(),

    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/css/[name]/[name].css`,
    }),

    new RemovePlugin({
      after: {
        root: './local/templates/main/assets',
        test: [
          {
            folder: './js',
            method: (absoluteItemPath) => {
                return new RegExp(/\.styles/, 'm').test(absoluteItemPath);
            }
          },
        ]
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(svg|png|jpg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: `${PATHS.assets}/media/[name][ext]`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `${PATHS.assets}/fonts/[name][ext]`,
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          attrs: ['source:srcset', 'img:src']
        },
      },
      {
        test: /\.pug$/i,
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'pug-html-loader',
            options: {
              basedir: PATHS.src,
            },
          }
        ],
        exclude: /(node_modules)/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        }
      }
    },
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
        },
      }),
    ],
  },
};

module.exports = () => {
  config.mode = 'development';

  if (mode === 'production') {
    config.mode = 'production';
  }

  return config;
};

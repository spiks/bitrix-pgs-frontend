const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'local/templates/main'),
  assets: 'assets'
}

const PAGES_DIR = path.join(__dirname, 'src/pages');
const COMPONENTS_DIR = path.join(__dirname, 'src/components');
const VENDORS_DIR = path.join(__dirname, 'src/vendors');

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

  console.log(`Pages list: ${JSON.stringify(pagesMap)}`);
  return pluginInstances;
};

const getComponentsEntryPoints = () => {
  const componentsDirs = fs.readdirSync(COMPONENTS_DIR);

  const entryPointsMap = {};

  componentsDirs.forEach((componentDir) => {
    const [componentDirName] = componentDir.split('.');

    if (!entryPointsMap[componentDirName]) {
      entryPointsMap[componentDirName] = path.join(__dirname, `src/components/${componentDirName}/script.js`);
    }
  });

  console.log(`Components list: ${JSON.stringify(entryPointsMap)}`);
  return entryPointsMap;
}

const getVendorsEntryPoints = () => {
  const vendorsDirs = fs.readdirSync(VENDORS_DIR);

  const entryPointsMap = {};

  vendorsDirs.forEach((vendorDir) => {
    const [vendorDirName] = vendorDir.split('.');

    if (!entryPointsMap[vendorDirName]) {
      entryPointsMap[vendorDirName] = path.join(__dirname, `src/vendors/${vendorDirName}/script.js`);
    }
  });

  console.log(`Vendors list: ${JSON.stringify(entryPointsMap)}`);
  return entryPointsMap;
}

const config = {
  target: 'browserslist',
  entry: {
    ...getVendorsEntryPoints(),
    template: `${PATHS.src}/template/template.js`,
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
      '@utils': `${PATHS.src}/utils`,
      '@blocks': `${PATHS.src}/blocks`,
      '@modules': `${PATHS.src}/modules`,
    }
  },
  plugins: [
    ...initMultipleHtmlPlugin(),

    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/css/[name]/[name].css`,
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
          minimize: mode === 'production',
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
              pretty: true,
              basedir: PATHS.src,
            },
          }
        ],
        exclude: /(node_modules)/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          // options: {},
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

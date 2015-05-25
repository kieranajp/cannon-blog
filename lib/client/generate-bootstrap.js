import _ from 'lodash';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import webpack from 'webpack';
import devConfig from './webpack.dev.config';
import prodConfig from './webpack.prod.config';

module.exports = function({ routes }, cb) {
  console.log('Generating client side bundle');

  const source = fs.readFileSync(path.join(__dirname, 'client.js.hbs'), { encoding: 'utf8' });
  routes = _.map(routes, function(route) {

    // as they get imported, name cannot contain /
    route.name = route.name.replace('/', '_');
    return route;
  });

  const compiledClient = Handlebars.compile(source)({
    routes,
    json: JSON.stringify(routes, null, 2)
  });

  fs.writeFileSync(path.join(__dirname, 'out', 'client.js'), compiledClient);
  var config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

  webpack(config, function(err, stats) {
    console.log('Webpack Bundle Generated');
    cb();
  });
}
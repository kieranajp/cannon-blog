const pwd = process.cwd();
import path from 'path';
import glob from 'glob';

export default function findAndLoadPages(cb) {
  const pagesFolder = path.join(pwd, 'pages');
  const pages = glob('**/*.js', {
    cwd: pagesFolder
  }, function(err, pages) {
    if (err) return cb(err);

    cb(null, pages.map(function(page) {
      return {
        Component: require(path.join(pagesFolder, page)),
        path: page
      };
    }));
  });
}

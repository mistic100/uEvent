import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

export default {
    input   : 'index.js',
    output  : {
        file     : 'browser.js',
        name     : 'uevent',
        format   : 'umd',
        sourcemap: true,
        banner   : `/*!
 * ${pkg.name} (v${pkg.version})
 * @copyright 2015-${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.email}>
 * @licence ${pkg.license}
 */`,
    },
    plugins : [
        commonjs(),
        babel({
            exclude: 'node_modules/**',
        }),
    ]
};

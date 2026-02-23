const { src, dest, series } = require('gulp');
const zip = require('gulp-zip');
const packageJson = require('./package.json');

// Copiar CSS al directorio built que usa Ghost
function css() {
    return src('assets/css/*.css')       // aquí editas tú (assets/css/...)
        .pipe(dest('assets/built'));    // aquí se genera built/screen.css
}

// Copiar JS (si lo usas) al mismo patrón built
function js() {
    return src('assets/js/*.js')
        .pipe(dest('assets/built'));
}

// Tarea build
exports.build = series(css, js);

// Tarea para empaquetar el tema en un .zip
function zipTheme() {
    return src([
        '**/*',
        '!node_modules/**',
        '!dist/**',
        '!gulpfile.js',
        '!package-lock.json'
    ])
    .pipe(zip(`${packageJson.name}.zip`))
    .pipe(dest('dist'));
}

exports.zip = zipTheme;

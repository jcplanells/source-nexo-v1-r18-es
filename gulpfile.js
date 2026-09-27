const { src, dest, series } = require('gulp');
const zip = require('gulp-zip');
const packageJson = require('./package.json');
const fs = require('fs');

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

// Tareas para build de prueba (genera `dist-test/`).
// Copia los assets y el tema a `dist-test`. Si existe `home-alt.hbs`,
// lo copia como `home.hbs` dentro de `dist-test` para previsualizar.
function cssTest() {
    return src('assets/css/*.css')
        .pipe(dest('dist-test/assets/built'));
}

function jsTest() {
    return src('assets/js/*.js')
        .pipe(dest('dist-test/assets/built'));
}

function copyThemeTest() {
    return src([
        '**/*',
        '!node_modules/**',
        '!dist/**',
        '!dist-test/**',
        '!gulpfile.js',
        '!package-lock.json'
    ], { dot: true })
    .pipe(dest('dist-test'));
}

function copyPreview(done) {
    const srcPreview = 'home-alt.hbs';
    const destPreview = 'dist-test/home.hbs';
    if (fs.existsSync(srcPreview)) {
        fs.copyFileSync(srcPreview, destPreview);
    }
    done();
}

exports['build-test'] = series(cssTest, jsTest, copyThemeTest, copyPreview);

// Tarea para empaquetar el tema en un .zip
function zipTheme() {
    return src([
        '**/*',
        '!node_modules/**',
        '!dist/**',
        '!workers/**',
        '!gulpfile.js',
        '!package-lock.json'
    ])
    .pipe(zip(`${packageJson.name}.zip`))
    .pipe(dest('dist'));
}

exports.zip = zipTheme;

/*eslint no-console: "off"*/

const DEBUG = process.env.NODE_ENV !== 'production';

const path             = require('path');
const gulp             = require('gulp');
const sass             = require('gulp-sass');
const clean            = require('gulp-clean');
const babel            = require('gulp-babel');
const plumber          = require('gulp-plumber');
const imagemin         = require('gulp-imagemin');
const imageminMozjpeg  = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo     = require('imagemin-svgo');

const nodemon    = require('gulp-nodemon');

const babelConf = {
    presets: ['react'],
    plugins: [
        'transform-es2015-modules-commonjs',
        'transform-decorators-legacy',
        'transform-class-properties',
        [
            'babel-plugin-transform-require-ignore',
            {
                'extensions': ['.scss', '.css']
            }
        ]
    ]
};

const plumberConf = {
    handleError: function (err) {
        console.log(err);
        this.emit('end');
    }
};

const publicDir = 'public/';

// region Config JSON

const configSrcDir = ['common/config/**/*.json'];
const configPubDir = publicDir + 'common/config';

gulp.task('configs', function () {
    return gulp.src(configSrcDir)
        .pipe(gulp.dest(configPubDir));
});

//endregion

//region Modules JS

const modulesSrcDir = ['common/modules/**/*.js'];
const modulesPubDir = publicDir + 'common/modules';

gulp.task('modules', () =>
    gulp.src(modulesSrcDir)
        .pipe(plumber(plumberConf))
        .pipe(babel(babelConf))
        .pipe(gulp.dest(modulesPubDir))
);

//endregion

//region Helpers JS

const helpersSrcDir = ['common/helpers/**/*.js'];
const helpersPubDir = publicDir + 'common/helpers';

gulp.task('helpers', () =>
    gulp.src(helpersSrcDir)
        .pipe(plumber(plumberConf))
        .pipe(babel(babelConf))
        .pipe(gulp.dest(helpersPubDir))
);

//endregion

// region Backend JS

const backendJSSrcDir = ['backend/**/*.js'];
const backendJSPubDir = publicDir + 'backend';

gulp.task('backend-js', function () {
    return gulp.src(backendJSSrcDir)
        .pipe(plumber(plumberConf))
        .pipe(babel(babelConf))
        .pipe(gulp.dest(backendJSPubDir));
});

//endregion

// region Backend !JS

const backendNonJSSrcDir = ['backend/**/*.*', '!backend/**/*.js'];
const backendNonJSPubDir = publicDir + 'backend';

gulp.task('backend-nonjs', () =>
    gulp.src(backendNonJSSrcDir)
        .pipe(gulp.dest(backendNonJSPubDir))
);

//endregion

// region Frontend JS, JSX

const frontendJSSrcDir = ['frontend/**/*.jsx', 'frontend/**/*.js'];
const frontendJSPubDir = publicDir + 'frontend';

gulp.task('frontend-js', () =>
    gulp.src(frontendJSSrcDir)
        .pipe(plumber(plumberConf))
        .pipe(babel(babelConf))
        .pipe(gulp.dest(frontendJSPubDir))
);

//endregion

//region Frontend Images

const imagesSrcDir      = ['frontend/images/**/*.*', '!frontend/images/**/*.unmin.*'];
const imagesSrcDirUnmin = ['frontend/images/**/*.unmin.*'];
const imagesPubDir      = publicDir + 'frontend/images';

gulp.task('imagemin', () => {
    return gulp.src(imagesSrcDir)
        .pipe(imagemin([
            imageminMozjpeg(),
            imageminPngquant({ quality: '0-80' }),
            imageminSvgo()
        ]))
        .pipe(gulp.dest(imagesPubDir));
});

gulp.task('imageunmin', () => {
    return gulp.src(imagesSrcDirUnmin)
        .pipe(gulp.dest(imagesPubDir));
});

//endregion

//region Frontend CSS

gulp.task('sass', () => {
    return gulp.src('frontend/css/**/*.*')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/frontend/css/'));
});

//endregion

// region Frontend !JS, !JSX !CSS !IMAGES

const frontendNonJSSrcDir = ['frontend/**/*.*', '!frontend/images/**/*.*', '!frontend/css/**/*.*', '!frontend/**/*.js', '!frontend/**/*.jsx'];
const frontendNonJSPubDir = publicDir + 'frontend';

gulp.task('frontend-nonjs', () =>
    gulp.src(frontendNonJSSrcDir)
        .pipe(gulp.dest(frontendNonJSPubDir))
);

//endregion

gulp.task('clean', () => {
    return gulp.src(['public/*', '!public/app'])
        .pipe(clean());
});

gulp.task('default', gulp.series('clean', 'configs', 'modules', 'helpers', 'backend-js', 'backend-nonjs', 'frontend-js', 'frontend-nonjs', 'imagemin', 'imageunmin', 'sass', function (done) {

    if (DEBUG) {
        //region Config JSON

        const configWatcher = gulp.watch(configSrcDir);
        configWatcher.on('change', (file) => {
            if (file.includes('tmp')) return;
            console.log('File ' + file + ' was changed');

            gulp.src([file])
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        //endregion

        //region Modules JS watch

        const modulesWatcher = gulp.watch(modulesSrcDir);
        modulesWatcher.on('change', (file) => {
            console.log('File ' + file + ' was changed');
            gulp.src([file])
                .pipe(plumber(plumberConf))
                .pipe(babel(babelConf))
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        //endregion

        //region Helpers JS watch

        const helpersWatcher = gulp.watch(helpersSrcDir);
        helpersWatcher.on('change', (file) => {
            console.log('File ' + file + ' was changed');
            gulp.src([file])
                .pipe(plumber(plumberConf))
                .pipe(babel(babelConf))
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        //endregion

        //region Backend JS

        const backendJSWatcher = gulp.watch(backendJSSrcDir);
        backendJSWatcher.on('change', (file) => {
            if (file.includes('tmp')) return;
            console.log('File ' + file + ' was changed');

            gulp.src([file])
                .pipe(plumber(plumberConf))
                .pipe(babel(babelConf))
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        //endregion

        //region Backend !JS

        const backendNonJSWatcher = gulp.watch(backendNonJSSrcDir);
        backendNonJSWatcher.on('change', (file) => {
            if (file.includes('tmp')) return;
            console.log('File ' + file + ' was changed');

            gulp.src([file])
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        //endregion

        //region Frontend JS, JSX

        const frontendWatcher = gulp.watch(frontendJSSrcDir);
        frontendWatcher.on('change', (file) => {
            setTimeout(function () {
                if (file.includes('tmp')) return;
                console.log('File ' + file + ' was changed');

                gulp.src([file])
                    .pipe(plumber(plumberConf))
                    .pipe(babel(babelConf))
                    .pipe(gulp.dest(publicDir + path.dirname(file)));
            }, 1000);
        });

        //endregion

        //region Frontend Images

        const imagesWatcher = gulp.watch(imagesSrcDir);

        imagesWatcher.on('change', (file) => {
            console.log('File ' + file + ' was changed');
            gulp.src([file])
                .pipe(imagemin([
                    imageminMozjpeg(),
                    imageminPngquant({ quality: '0-80' }),
                    imageminSvgo()
                ]))
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        const unminImagesWatcher = gulp.watch(imagesSrcDirUnmin);

        unminImagesWatcher.on('change', (file) => {
            console.log('File ' + file + ' was changed');
            gulp.src([file])
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });


        //endregion

        //region Frontend !JS, !JSX !CSS !IMAGES

        const frontendNonWatcher = gulp.watch(frontendNonJSSrcDir);
        frontendNonWatcher.on('change', (file) => {
            if (file.includes('tmp')) return;
            console.log('File ' + file + ' was changed');

            gulp.src([file])
                .pipe(gulp.dest(publicDir + path.dirname(file)));
        });

        //endregion

        // configure nodemon
        nodemon({
            // the script to run the app
            script: 'public/backend/index.js',
            ext: 'js jsx ejs css json',
            env: { 'NODE_PATH': 'public/' }
        }).on('restart', function(){
            // when the app has restarted, run livereload.
            gulp.src('public/backend/index.js')
        });
    }

    done();
}));

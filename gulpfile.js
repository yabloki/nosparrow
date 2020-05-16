const gulp = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const path = require('path');
const plumber = require('gulp-plumber');
const vfs = require('vinyl-fs');
const GulpDockerCompose = require('gulp-docker-compose').GulpDockerCompose;

const srcFolder = `${__dirname}/src/`;
const dstFolder = `${__dirname}/build/`;

var gulp = require('gulp');
var grunt = require('grunt');

grunt.initConfig({
    copy: {
        main: {
            src: 'src/*',
            dest: 'dest/'
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-copy');

gulp.task('copy', function (done) {
    grunt.tasks(
        ['copy:main'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function () {done();}
    );
});

// clean the previous build
gulp.task('clean', function() {
    return gulp.src(dstFolder, {read: false})
        .pipe(clean({force: true}));
});

// compile js
gulp.task('build', ['clean'], function() {
    // vfs follows symlinks
    return vfs.src(srcFolder+'/**/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: [
                ["env", {
                    "targets": {
                        "node": "4"
                    },
                    "modules": "commonjs",
                }],
            ]
        }))
        .pipe(vfs.dest(dstFolder));
});

var gulpDocker = new GulpDockerCompose(gulp, {
    serviceName: 'app',
    tasks: {
        run: {
            name: 'run',
            dependences: ['build'],
        },
        restart: {
            name: 'restart',
            dependences: ['build'],
        },
        watchYML: {
            name: 'watch-yml',
        },
    },
    extraArgs: {
        upOnRun: '--scale app=3',
        upOnYMLChange: '--scale app=3',
    },
    exposeCLICommands: true,
    exposeStdOut: false,
    exposeStdErr: true,
    projectFolder: __dirname,
});

gulp.task('watch', function() {
    gulp.watch([srcFolder+'/**/*'], ['build', 'restart']);
});
gulp.task('default', ['build', 'watch', 'watch-yml', 'run']);
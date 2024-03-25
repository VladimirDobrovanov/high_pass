const { src, dest, series, watch} = require('gulp')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const image = require('gulp-image')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const browserSync = require('browser-sync').create()

const clean = () => {
  return del(['dist'])
}

const styles = () => {
 return src('src/styles/**/*.css')
  .pipe(sourcemaps.init())
  .pipe(concat('main.css'))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(sourcemaps.write())
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
}

const htmlminify = () => {
  return src('src/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
}


const config = {
  mode: {
    view: { // Activate the «view» mode
      bust: false,
      render: {
        scss: true // Activate Sass output (with default options)
      }
    },
    symbol: true // Activate the «symbol» mode
  }
};

const svgSprites = () => {
 return src('src/img/svg/**/*.svg')
 .pipe(svgSprite(config))
 .pipe(dest('dist/img'))
}



const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png',
    'src/img/*.svg',
  ])
  .pipe(image())
  .pipe(dest('dist/img'))
}

watch('src/**/*.html', htmlminify)
watch('src/styles/**/*.css', styles)
watch('src/images/svg/**/*.svg', svgSprites)



exports.default = series(clean, htmlminify, styles, images, svgSprites, watchFiles)

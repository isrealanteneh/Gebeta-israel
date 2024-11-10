const fsx = require('fs-extra')
const fs = require('fs')
const path = require('path')

const files = fs.readdirSync('.').filter(f => f.indexOf('.html') !== -1)

console.log(files)

files.forEach(f => {
    fsx.copySync(f, ['..', 'backend', 'src', 'views', f.replace('.html', '.ejs')].join(path.sep));
})
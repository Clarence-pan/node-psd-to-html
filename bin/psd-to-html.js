const path = require('path')
const psd2html = require('../src/psd-to-html')


try {
    var opt = require('node-getopt')
        .create([
            ['o', 'output=OUTPUT', 'Output .html file'],
            ['r', 'res-dir=RES_DIR', 'Directory for saving resource files'],
            ['b', 'base-url=BASE_URL', 'Base URL for resource files'],
            ['h', 'help', 'display this help']
        ])
        .bindHelp(`
 Usage: node psd-to-html.js <input-psd-file>

   <input-psd-file>         Input .psd file
   -o, --output=OUTPUT      Output .html file
   -r, --res-dir=RES_DIR    Directory for saving resource files
   -b, --base-url=BASE_URL  Base URL for resource files
   -h, --help               display this help
        `.trim())
        .parseSystem()

    if (!opt) {
        quit('Error: Failed to parse command line options!')
    }

    if (!opt.argv.length) {
        quit('Error: You must use specify an input .psd file!')
    }

    if (opt.argv.length > 1) {
        quit('Error: only one input file should be specified.')
    }

    if (!opt.options.output) {
        opt.options.output = opt.argv[0].replace(/\.\w+$/, '.html')
    }


    psd2html(
            opt.argv[0],
            opt.options.output,
            {
                outputResouceDir: opt.options['res-dir'],
                outputResourceUrlBase: opt.options['base-url']
            }
        )
        .then(() => {
            console.log(`Convertion completed.`)
            quit(0)
        })
        .catch(e => {
            console.log(`Convertion failed: `, e)
            quit(1)
        })
} catch (e) {
    console.log(`Got error in convertion: `, e)
    quit(2)
}


function quit(msg, ret) {
    if (!isNaN(msg)) {
        ret = msg;
        msg = false;
    }

    if (msg) {
        console.log(msg)
    }

    process.exit(typeof ret === 'undefined' ? 1 : ret)
}

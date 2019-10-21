Node version script

// Reversion Angular Library Versioning
// **************************************************
// by Louis Angelopoulos
// https://github.com/topoulos/reversion-angular-libs
// **************************************************
// Sets all the libraries to the same version number
// in an Angular Library application composed with NX

/* jshint esversion: 9 */
/* jslint node: true */
'use strict';

const program = require('commander');
const execSync = require('child_process').execSync;
const Colors = require('./scripts/npm/colors').Colors;
const execOpts = {
    stdio: [0, 1, 2]
};
const version = '1.0.0';

const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'libs');

/** Commander Options */
program
    .name('ReVersion for NX Angular Libraries')
    .description('Reversions all libraries in angular library project to the same version number')
    .version(version, '-v, --version')
    .usage('[OPTIONS]...')
    .option('-s, --set-version <version>', 'the version to apply')
    .option('-d, --library-directory <directory>', 'the library folder. typically "libs" or "apps"')
    .option('-c, --custom-subdirectory <custom-subdirectory>', 'optionally, the subdirectory to look for package.json in')
    .parse(process.argv);

main();

/**
 * Entry point
 */
function main() {
    const isError = !program.setVersion;

    drawApplicationHeader();

    // Just set the defaults
    program.libraryDirectory = program.libraryDirectory || 'libs';
    program.customSubdirectory = program.customSubdirectory || '';

    if (isError) {
        console.error('must provide --set-version.  Run: node reversion --help for options');
        process.exit(1);
    } else {
        fs.readdir(directoryPath, function(err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            files.forEach(function(file) {
                buildHeader('Processing Library:  ' + file, Colors.LIGHT_BLUE, '-', Colors.CYAN);

                if (!file.startsWith('.')) {
                    exec(`npm --prefix=./${program.libraryDirectory}/${file}/${program.customSubdirectory ? program.customSubdirectory : ''} version ${program.setVersion} --git-tag-version=false --commit-hooks=false --allow-same-version=true`)
                    console.log(file);
                }
            });
        });
    }
}

/**
 * Builds a spparater with title, color, etc.
 * @param {*} title
 * @param {*} sepChar
 * @param {*} titleColor
 * @param {*} sepColor
 * @param {*} totchars
 */
function buildSeperator(title = '', sepChar = '=', titleColor = Colors.LIGHT_CYAN, sepColor = Colors.BLUE, totchars = process.stdout.columns / 2) {
    let str = [];
    let seps = [];

    title = !title ? '' : title;

    let totSeps = totchars - (title.length > 0 ? title.length : 0);
    for (let i = 0; i < totSeps; i++) {
        seps.push(sepChar);
    }

    if (title.length > 0) {
        str.push({
            color: titleColor,
            text: title
        });
        str.push({
            color: Colors.NC,
            text: ' '
        });
    }
    str.push({
        color: sepColor,
        text: seps.join('')
    });

    exec(buildString(str));
}

/**
 * Outputs a blank line
 */
function blankLine() {
    exec('echo ');
}

/**
 * Runs a comman synchornously
 * @param {string} command
 */
function exec(command) {
    execSync(command, execOpts);
}

/**
 * Outputs cthe content of a Piece object
 * Into an string for use with an output
 * stream.
 * @param {Piece[]} pieceAry
 */
function buildString(pieceAry) {
    let response = [];

    for (let p of pieceAry) {
        response.push(`${p.color}${p.text}${Colors.NC}`);
    }

    return `echo "${response.join('')}"`;
}

/**
 * Draw the main applicatin Header
 */
function drawApplicationHeader() {
    buildHeader(`Reversion - Angular Library Reversioning - ${version}`, Colors.YELLOW, Colors.RED);
}

/**
 * Creates a banner header that repeats a character and
 * a label in the specified colors.
 * @param {string} text
 * @param {string} textColor
 * @param {char} bannerChar
 * @param {string} bannerColor
 */
function buildHeader(text, textColor, bannerChar, bannerColor) {
    buildSeperator('', bannerChar, textColor, bannerColor);
    buildSeperator(text, ' ', textColor, Colors.NC);
    buildSeperator('', bannerChar, textColor, bannerColor);
    blankLine();
}

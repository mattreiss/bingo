// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gtts = require('gtts');


function saveAudio(text) {
    const gtts = new Gtts(text, 'en');
    gtts.save('src/static/audio/' + text + '.mp3', function (err){
        if(err) { throw new Error(err); }
    });
}

function generateBingoNumbers(size) {
    const bingo = 'BINGO';
    bingo.split('').forEach((letter, index) => {
        for (let i = 1; i <= size / bingo.length; i++) {
            const offset = index * size / bingo.length;
            const number = i + offset;
            saveAudio(`${letter}${number}`);
        }
    });
}

const sizes = [75];

sizes.forEach(generateBingoNumbers);
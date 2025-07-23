import checkEngine from 'check-engine';

checkEngine('package.json').then((result) => {
    if (result.status !== 0) {
        return;
    }
    if (result.message.type === 'success') {
        return;
    }

    if (result.message.text === 'undefined' || result.packages === 'undefined') {
        console.error('\x1b[31mEnvironment is invalid!\x1b[0m');
    } else {
        console.error('\x1b[31m' + result.message.text + '\x1b[0m');
        console.error(result.packages);
    }

    process.exitCode = 1;
});

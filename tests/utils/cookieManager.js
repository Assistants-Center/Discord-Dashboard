const fs = require('fs');
const path = require('path');

const COOKIE_FILE_PATH = path.join(process.cwd(), 'tests/cookie.json');

const requestSessionCookie = async () => {
    const file = JSON.parse(
        fs.readFileSync(path.join(COOKIE_FILE_PATH), 'utf8'),
    );
    return file.value;
};

module.exports = requestSessionCookie;

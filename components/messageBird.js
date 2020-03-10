const messagebird = require('messagebird')('XVyAhIdNwJbwe9iVQtIGYBRdM');

module.exports = (text) => {
    const params = {
        'originator': 'REDACTED-PHONE',
        'recipients': [
            'REDACTED-PHONE'
        ],
        'body': text
    };

    messagebird.messages.create(params, function (err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
};
const messagebird = require('messagebird')('XVyAhIdNwJbwe9iVQtIGYBRdM');

module.exports = (text) => {
    const params = {
        'originator': '+31638643409',
        'recipients': [
            '+31638643409'
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
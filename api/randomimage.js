const Constants = require('../controllers/constants');
const Db = require('../controllers/db');
const Check = require('../controllers/check');
const Utility = require('../controllers/utility');
import * as data from '../images/images.js';

// Random Quote - Optional Parameter language (en, it) - Default Value en
export default async function handler(req, res) {
    console.log('Start');
    const { language, newmode } = req.query;
    const ret = Check.checkParam('language', language, Constants.LANGUAGES, true);

    if (ret.error) {
        res.status(401).json(Utility.formatErr(401, 'random', ret.error));
        return;
    }

    if (Db.connection() === null) {
        res.status(401).json(Utility.formatErr(401, 'random', 'Error in DB Connection.'));
        return;
    }

    const retRandom = await Db.randomQuote(language);

    if (retRandom.error === null) {
        if (typeof newmode === 'undefined' || newmode === 'no') {
            const image = data.images[Math.floor(Math.random() * data.images.length)];
            
            const response = {
                image: image['name'],
                opacity: image['opacity'],
                fontSize: image['font-size'],
                quote: retRandom.data[0].quote,
                author: retRandom.data[0].author
            };

            res.status(200).json(response);
        } else {
            const response = {
                image: 'https://random.imagecdn.app/1080/2222',
                opacity: 0.4,
                fontSize: '40px',
                quote: retRandom.data[0].quote,
                author: retRandom.data[0].author
            };

            res.status(200).json(response);
        }
    } else {
        res.status(401).json(retRandom.error);
    }
};
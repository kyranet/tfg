const keyword_extractor = require("keyword-extractor");
const daoTags = require("./../database/services/daos/daoTags");

const computeTags = async (req, res = response) => {
    try {  
        // ? Extract the keywords
        let extraction_result = keyword_extractor.extract(req.query.descrip, {
            language: "spanish",
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: true,
        });

        let tags = extraction_result;
        return res.status(200).json({
            ok: true,
            tags,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "[ERROR] Getting the tags from description.",
        });
    }
};

const computePossibleTags = async (req, res = response) => {
    try {
        tags = await daoTags.readByStartWithWord(req.query.text);

        return res.status(200).json({
            ok: true,
            tags,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: "[ERROR] Getting the possibler tags from description.",
        });
    }
};

module.exports = {
    computeTags,
    computePossibleTags
};

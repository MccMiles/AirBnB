const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ReviewImage } = require('../../db/models');

// Delete Review Image

router.delete('/:imageId', requireAuth, async(req, res) => {
    const user = req.user.id;

    const ri = await ReviewImage.findByPk(req.params.imageId);

    if(ri) {
        await ri.destroy();

        return res.status(200).json({message: "Successfully deleted", statusCode: 200})
    } else {
        return res.status(404).json({message: "Review Image couldn't be found", statusCode: 404})
    }
});

module.exports = router;
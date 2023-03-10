const express = require('express');
const router = express.Router();

const { User, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


router.delete('/:imageId', requireAuth, async(req, res) => {

    const si = await SpotImage.findByPk(req.params.imageId);

    if(si) {

        await si.destroy();
        return res.status(200).json({ message: "Successfully deleted", statusCode:200 });
    } else {

        return res.status(404).json({ message: "Spot Image couldn't be found", statusCode:404 });
    }
})




module.exports = router;
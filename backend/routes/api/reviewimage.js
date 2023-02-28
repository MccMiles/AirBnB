const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');
const router = express.Router();

// Delete a Review Image

router.delete('/:imageId', requireAuth, async(req, res) => {
    
    const user = req.user.id;

    const doesExist = await ReviewImage.findByPk(req.params.imageId);

    if(doesExist) {

        await doesExist.destroy();
        return res.status(200).json({message: "Successfully deleted", statusCode: 200})

    } else {

        return res.status(404).json({message: "Review Image couldn't be found", statusCode: 404})
    }
});

module.exports = router;
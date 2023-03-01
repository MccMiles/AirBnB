const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');
const router = express.Router();

//Delete a Review Image

router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId = req.user.id
    const ri = await ReviewImage.findByPk(req.params.imageId, {
        include: { model: Review }
    })

    if(!ri) {
        res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if(ri.Review.userId !== userId) {
        res.status(403).json({
            message: "User not authorized",
            statusCode: 403
        })
    }

    await ri.destroy()
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

module.exports = router;
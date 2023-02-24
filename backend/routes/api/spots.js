const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { up } = require('../../db/seeders/20230120053909-demo-spot');
const router = express.Router();

const validateSpot = [
    check('address')
    .exists({checkFalsy: true})
    .withMessage('Street address is required'),
    check('city')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('City is required'),
    check('state')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('State is required'),
    check('country')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Country is required'),
    check('lat')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Latitude is not valid'),
    check('lng')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Longitude is not valid'),
    check('name')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Name must be less than 50 characters'),
    check('description')
    .exists({checkFalsy: true})
    .isString()
    .withMessage('Description is required'),
    check('price')
    .exists({checkFalsy: true})
    .isNumeric()
    .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
    .exists({checkFalsy: true})
    .isString()
    .withMessage("Review text is required"),
    check('stars')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const validateBooking = [
    check('startDate')
    .exists()
    .isBefore('endDate')
    .isDate()
    .withMessage('endDate cannot be on or before startDate'),
    check('endDate')
    .exists()
    .isAfter('startDate')
    .isDate()
    .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
];


const validateQuery = [
    check('page')

]

//Get All Spots

router.get('/', async (req, res) =>{
    let {page, size} = req.query;

    page = Number(page);
    size = Number(size);

    if(Number.isNaN(page) || size < 0) page = 1;
    if(Number.isNaN(size) || size < 0) size = 25;

    let allSpots = [ ];

    allSpots = await Spot.findAll({
        limit: size,
        offset: Math.abs(size * (page - 1)),
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price'
        ]
    });
   
    for await(let spot of allSpots) {
        const previewIs = await SpotImage.findOne({
            where: { spotId: spot.id, preview: true } });

        if(previewIs) spot.dataValues.previewIs = previewIs.url

        spot.dataValues.previewIs = null;

        const data = await Review.findAll({
        where: { spotId: spot.id } })

        if(data.length) {

        let sum = 0;

        data.forEach(rate => {
            sum += rate.stars
        });

        let avg = sum / data.length

        spot.dataValues.avgRating = avg;

        } else {
        spot.dataValues.avgRating = null ;
        }
    }

    return res.json({allSpots, page, size});
});

//Get All spots owned by Current User

router.get('/current', requireAuth, async(req, res) =>{

    let ownedSpots = [ ];

    ownedSpots = await Spot.findAll({

        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price'
        ]
    });

        for await(let spot of ownedSpots) {

            const previewIs = await SpotImage.findOne({
            where: { spotId: spot.id, preview: true } });

            if(previewIs)  spot.dataValues.previewIs = previewIs.url

            spot.dataValues.previewIs = null;
            }

            const data = await Review.findAll({ where: { spotId: spot.id } });

            if(data.length) {
                let sum = 0;

                data.forEach(rate => {
                    sum += rate.stars
                });

                let avg = sum / data.length;

                spot.dataValues.avgRating = avg;
            } else {

                spot.dataValues.avgRating = null;
            }

    return res.json(ownedSpots)
});

//Get details of a Spot From An id

router.get('/:spotId', async (req, res) => {

    const selected = await Spot.findByPk(req.params.spotId, {
        include: [
                    { model: User },
                    { model: SpotImage }
            ]
        })

    const user = await User.findByPk(req.params.userId);

    if(!selected){

        return res.status(404).json({message: "Spot couldn't be found", statusCode: 404})
    }

    res.json(selected)

});


//Create a Spot
router.post('/', validateSpot, handleValidationErrors, async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({ address, city, state, country, lat, lng, name, description, price, ownerId: req.user.id});

    return res.json(spot);

});


//Add an Image to a Spot based on Spot's id

router.post('/:spotId/images', async(req, res) =>{

    const current = await Spot.findByPk(req.params.spotId);

    if(!current) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found", statusCode: 404 });
    }

        const { url, preview } = req.body;

        const img = await SpotImage.createImage({
            preview,
            url,
        })

        const resObj = {
            id: img.id,
            url: img.url,
            preview: img.preview
        };
        return res.status(201).json(resObj)
});



//Edit a Spot

router.put('/:spotId', requireAuth, async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const toUpdate = await Spot.findByPk(req.params.spotId);

    if(toUpdate) {
            if(address) toUpdate.address = address;
            if(city) toUpdate.city = city;
            if(state) toUpdate.state = state;
            if(country) toUpdate.country = country;
            if(lat) toUpdate.lat = lat;
            if(lng) toUpdate.lng = lng;
            if(name) toUpdate.name = name;
            if(description) toUpdate.description = description;
            if(price) toUpdate.price = price;

            await toUpdate.save();

           return res.json({ toUpdate })
        } else {
            return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 })
    }


});


//Delete a Spot

router.delete('/:spotId', requireAuth, async(req, res) => {

        const user = req.user.id;
        const toDelete = await Spot.findByPk(req.params.spotId);

        if(toDelete) {
            await toDelete.destroy();
            res.status(200).json({ message: "Successfully deleted", statusCode: 200 })
        } else {
            res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 })

        }

});

//Get All Reviews by a Spot's id

router.get('/:spotId/reviews', async (req, res) =>{

    let reviews = [ ];

    const spot = await Spot.findByPk(req.params.spotId)

if(spot) {

    reviews = await Review.findAll({
        attributes: {
            include: [
                'userId',
                'spotId',
                'review',
                'stars'
                ]
        },
        include: 
            [{ model: User },
            { model: ReviewImage }]
    })

} else {
    res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 })
    }
return res.json(reviews);
});


//Create a Review for spot on Spot's id

router.post('/:spotId/reviews', validateReview, requireAuth, async (req, res) =>{

    const { review, stars } = req.body;

    const reviewStatus = await Review.findOne({
        where: {
            userId:req.user.id,
            spotId:req.params.spotId
        }
    });

    if(reviewStatus) {
        res.status(403).json({message: "User already has a review for this spot", statusCode: 403})
    };

    const spotStatus = await Spot.findByPk(req.params.spotId);

    if(!spotStatus) {
        res.status(404).json({message: "Spot couldn't be found", statusCode: 404});
    };

    const newReview = await Review.create({review, stars, userId:req.user.id, spotId:req.params.spotId});

    res.json(newReview);

});




module.exports = router;
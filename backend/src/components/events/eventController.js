const eventService = require('./eventService');
const eventRepo = require('./eventRepository')
const { validationResult } = require('express-validator');

// Create a new preference tag
exports.createHistoricalTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const checkUserType =await eventRepo.getTypeForTag(req.params._id);
        console.log(checkUserType)
        if(checkUserType !== 'tourismGovernor'){
            return res.status(400).json({ message: 'Only tourism governors can create historical tags' });
        }
        const checkTagType = req.body.type.toLowerCase();
        if (
        checkTagType === 'monuments' || 
        checkTagType === 'museums' || 
        checkTagType === 'religious' || 
        checkTagType === 'sites' || 
        checkTagType === 'palaces' || 
        checkTagType === 'castles' || 
        checkTagType === 'palaces/castles'
        ) {

            try{
                const tag = await eventService.createHistoricalTag(req.body);
                response={
                    message: "Historical tag created successfully",
                    tag: tag
                }
                res.status(201).json(response);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }

        }else{
            return res.status(400).json({ message: 'Only historical tags can be created' });
        }


        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};





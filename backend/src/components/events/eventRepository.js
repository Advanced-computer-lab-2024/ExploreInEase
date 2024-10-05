
const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
// const ActivityCategory = require('../../models/activityCategory'); 
const HistoricalTag = require('../../models/historicalTag'); 
const User = require('../../models/user');
const Tourist = require('../../models/tourist');

//create historical tag
const createHistoricalTag = async (tagData) => {
  const tag = new HistoricalTag(tagData);
  return await tag.save();
};


const getTypeForTag = async (id) => {
  const user = await User.findOne({ _id: id });
  return user.type
};

module.exports = {createHistoricalTag,getTypeForTag};
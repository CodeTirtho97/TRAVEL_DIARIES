const Joi = require("joi");

module.exports.diarySchema = Joi.object({
  diary: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    cost: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required().min(50),
  }).required(),
});

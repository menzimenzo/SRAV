const emailSchema = (joi) => ({
  to: joi.string().email().required(),
  cc: joi.string().email(),
  ci: joi.string().email(),
  from: joi.string().email(),
  subject: joi.string().required(),
  body: joi.string().required(),
  attachments : joi.array(),
  replyTo: joi.string()
})

module.exports = emailSchema

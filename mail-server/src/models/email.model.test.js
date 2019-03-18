const joi = require('joi')
const Email = require('./email.model.js')(joi)
const Assert = require('assert')

const goodEmail = {
  to: 'smtp.synaltic@gmail.com',
  subject: 'test subject',
  body: 'TEST'
}

const goodEmailAttachments = {
  to: 'smtp.synaltic@gmail.com',
  subject: 'test subject',
  body: 'TEST', 
  attachments: [        {
      filename: 'image.png',
      content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),

      cid: 'note@example.com' // should be as unique as possible
    }
    ]
}

const wrongEmail = {
  to: 'test',
  subject: 'test subject',
  body: 'TEST'
}

const incompleteEmail = {
  body: 'TEST'
}



/**
 *  JEST TESTING
 */


describe('Email model', ()=> {
  it('Well formatted email are validated', () => {
    const {error, value} = joi.validate(goodEmail, Email);
    Assert.equal(!!error, false, 'error should be empty')
  })

  it('Well formatted email with attachments are validated', () => {
    const {error, value} = joi.validate(goodEmailAttachments, Email);
    Assert.equal(!!error, false, 'error should be empty')
  })

  it('Malformatted to cannot be validated', () => {
    const {error, value} = joi.validate(wrongEmail, Email);
    Assert.ok(error)
  })

  it('Missing to cannot be validated', () => {
    const {error, value} = joi.validate(incompleteEmail, Email);
    Assert.ok(error)
  })
})

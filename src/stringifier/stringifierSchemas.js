const healCheckResponseSchema = {
  title: 'Health Check Response',
  type: 'object',
  properties: {
    message: {
      type: 'string'
    }
  }
};

module.exports = {
  healCheckResponseSchema
};

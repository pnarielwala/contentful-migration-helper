const { config } = require('dotenv');

const ENV = config().parsed ?? {};

module.exports = {
  spaceId: ENV.CONTENTFUL_SPACE_ID,
  managementToken: ENV.CONTENTFUL_MANAGEMENT_TOKEN,
  migrationDirectory: 'migrations',
};

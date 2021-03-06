const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({
  endpoint: `https://secretsmanager.${process.env.SLS_REGION}.amazonaws.com`,
  region: process.env.SLS_REGION
});

const getSecretValue = async key => {
  const data = await client.getSecretValue({SecretId: key}).promise();
  if (data.SecretString !== '') {
    return data.SecretString;
  }
  return data.SecretBinary;
};

module.exports = {getSecretValue};

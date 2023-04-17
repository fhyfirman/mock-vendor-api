require("dotenv").config();

const axios = require("axios");
const CryptoJS = require("crypto-js");

const { API_KEY, API_SECRET_KEY, API_ENDPOINT, API_HTTP_METHOD } = process.env;

const authTesting = async (
  apiKey,
  apiSecretKey,
  apiEndpoint,
  apiHttpMethod
) => {
  const timestamp = new Date().getTime().toString();
  const body = JSON.stringify({
    key: "testing-auth",
  });

  // TODO: support for another http method
  // for now it's only available for GET method
  let rawSignature = `${timestamp}\r\n${apiHttpMethod}\r\n${apiEndpoint}\r\n\r\n${body}`;

  if (apiHttpMethod === "GET") {
    rawSignature = `${timestamp}\r\n${apiHttpMethod}\r\n${apiEndpoint}`;
  }

  const signature = CryptoJS.HmacSHA256(rawSignature, apiSecretKey).toString();

  const token = `${apiKey}:${timestamp}:${signature}`;

  const response = await axios({
    method: apiHttpMethod,
    url: apiEndpoint,
    headers: {
      Authorization: `hmac ${token}`,
    },
  });

  return response;
};

authTesting(API_KEY, API_SECRET_KEY, API_ENDPOINT, API_HTTP_METHOD)
  .then((res) => {
    console.log(`RESPONSE: ${res}`);
  })
  .catch((err) => {
    console.log(`ERROR: ${JSON.stringify(err.response.data)}`);
  });

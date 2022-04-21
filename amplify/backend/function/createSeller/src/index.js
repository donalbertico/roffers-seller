const aws = require('aws-sdk')
const cognito = new aws.CognitoIdentityServiceProvider()
const docClient = new aws.DynamoDB.DocumentClient();
/* Amplify Params - DO NOT EDIT
	API_ROFFERS_GRAPHQLAPIENDPOINTOUTPUT
	API_ROFFERS_GRAPHQLAPIIDOUTPUT
	API_ROFFERS_GRAPHQLAPIKEYOUTPUT
	AUTH_ROFFERS_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    let params = JSON.parse(event.body)
    let name = 'la casa de la ver'
    let date = new Date()

    let response = await cognito.adminCreateUser(
        {
            UserPoolId : process.env.AUTH_ROFFERS_USERPOOLID,
            Username : params.email
        }).promise()

    if (response.User) {
        await cognito.adminSetUserPassword({
                Password: 'rofferSeller22',
                UserPoolId : process.env.AUTH_ROFFERS_USERPOOLID,
                Username : params.email,
                Permanent : true
              }).promise()
        await cognito.adminAddUserToGroup({
                GroupName : 'seller',
                Username : params.email,
                UserPoolId : process.env.AUTH_ROFFERS_USERPOOLID
            }).promise()
        await docClient.put({
            TableName : process.env.API_ROFFERS_SELLERTABLE_NAME,
            Item : {
                id : `${params.email}-${name.split(" ").join("")}`,
                name : params.businessName,
                owner : params.email,
                createdAt : date.toISOString(),
                updatedAt : date.toISOString(),
                _version : 1,
                _lastChangedAt : date.getTime(),
                __typename : 'Seller'
            }
        }).promise()
    }

    return {
        statusCode: 200,
        headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(`Hello from Lambda nigga! ${params.email}`),
    };
};

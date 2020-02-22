const httpRequest = require('./httpRequest');
const amityOAuthToken = "xoxb-886820869057-952795023555-CL1jFYywckCDSCkOmOzrrTeI";

getListUsers = function(oAuthToken, next) {
    endPoint = `https://slack.com/api/users.list?token=${oAuthToken}&pretty=1`;
    httpRequest.get(endPoint, next);
}

postMessage = function(oAuthToken, channel, text, next) {
    endPoint = `https://slack.com/api/chat.postMessage?token=${oAuthToken}&channel=${channel}&text=${text}&pretty=1`;
    httpRequest.post(endPoint, null, next);
}

openConversation = function(oAuthToken, userID, next) {
    endPoint = `https://slack.com/api/conversations.open?token=${oAuthToken}&channel=${userID}&pretty=1`;
    httpRequest.post(endPoint, null, next);
}

openGroupConvsersation = function(oAuthToken, users, next) {
    usersArg = "";
    for (i = 0; i < users.length; i++) {
        usersArg += users[i] + "%2C";
    }
    usersArg = usersArg.substring(0, usersArg.length - 3);
    endPoint = `https://slack.com/api/conversations.open?token=${oAuthToken}&users=${usersArg}&pretty=1`;
    httpRequest.post(endPoint, null, next);
}

exports.getListUsers = getListUsers;
exports.postMessage = postMessage;
exports.openConversation = openConversation;
exports.openGroupConvsersation = openGroupConvsersation;
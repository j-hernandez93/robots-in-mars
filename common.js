function buildApiResponse({code, message, body = undefined}) {
  return {statusCode: code, message, body}
}

function buildRobotsOutput(results) {
  let strResult = ''
  for (const item of results) {
    strResult += item.join(" ") + '\n';
  }
  return strResult;
}

module.exports = {
  buildApiResponse,
  buildRobotsOutput
}

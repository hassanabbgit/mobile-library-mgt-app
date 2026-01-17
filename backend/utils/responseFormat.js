function success(data, message = "OK") {
  return { success: true, message, data };
}

function error(message, code = 400) {
  return { success: false, message, code };
}

module.exports = { success, error };

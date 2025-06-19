const dns = require("dns").promises; // To resolve MX records

// Check if the domain exists by resolving MX records
async function isValidDomain(email) {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (err) {
    return false; // Domain doesn't exist or no MX record
  }
}
module.exports = { isValidDomain }
async function IpQuery(){
  // https://api64.ipify.org/?format=json
  const response = await fetch("https://api64.ipify.org/?format=json")
  const data = await response.json()
  return data.ip
}

module.exports = IpQuery
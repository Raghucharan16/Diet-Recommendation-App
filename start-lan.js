const { execSync } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  
  // Collect all non-internal IPv4 addresses
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        candidates.push(iface.address);
      }
    }
  }
  
  // Prioritize 192.168.x.x (typical home WiFi)
  const wifiIP = candidates.find(ip => ip.startsWith('192.168.'));
  if (wifiIP) return wifiIP;
  
  // Then try 10.x.x.x
  const tenIP = candidates.find(ip => ip.startsWith('10.'));
  if (tenIP) return tenIP;
  
  // Return first available or fallback to localhost
  return candidates[0] || '127.0.0.1';
}

const localIP = getLocalIP();
const interfaces = os.networkInterfaces();
const allIPs = [];

// Collect all non-internal IPs
for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      allIPs.push(`${iface.address} (${name})`);
    }
  }
}

console.log(`\n🌐 Detected Local IP: ${localIP}`);
console.log(`📱 Your phone should be on the same WiFi network`);
if (allIPs.length > 1) {
  console.log(`\n💡 Available network interfaces:`);
  allIPs.forEach(ip => console.log(`   - ${ip}`));
  console.log(`\n   Using: ${localIP} (prioritizing WiFi 192.168.x.x)`);
}
console.log(`\n✨ Tip: Just scan the QR code with Expo Go - it works automatically!\n`);

// Set environment variable and start Expo
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = localIP;

// Start Expo with the detected IP
execSync('npx expo start --lan', { stdio: 'inherit' });

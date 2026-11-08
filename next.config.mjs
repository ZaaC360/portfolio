/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a phone on the same Wi-Fi load dev-mode scripts via this machine's LAN address.
  // shortcut: hard-coded IP, update it if the router gives this PC a new address.
  allowedDevOrigins: ["192.168.100.215"],
};

export default nextConfig;

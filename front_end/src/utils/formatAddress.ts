export default function formatAddress(addr: string) {
  return addr.slice(0, 4) + '...' + addr.slice(-4)
}

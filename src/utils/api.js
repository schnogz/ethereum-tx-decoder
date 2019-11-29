const apiKey = '3GG6H4NFTJ9JVTB2T892WDYKXUMTK9DWZZ'

export const fetchEthTxByHash = txHash =>
  fetch(
    `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`
  )

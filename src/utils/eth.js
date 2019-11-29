import { ethers } from 'ethers'
import { propOr } from 'ramda'

export const decodeEthHexTx = rawHexTx => {
  try {
    const decodedTx = ethers.utils.RLP.decode(rawHexTx)
    let [
      raw_nonce,
      raw_gasPrice,
      raw_gasLimit,
      raw_to,
      raw_value,
      raw_data,
      raw_v,
      raw_r,
      raw_s
    ] = decodedTx

    let tx = {
      nonce: ethers.utils.bigNumberify(raw_nonce).toNumber(),
      gasPrice: ethers.utils.bigNumberify(raw_gasPrice),
      gasLimit: ethers.utils.bigNumberify(raw_gasLimit),
      to: raw_to,
      value: ethers.utils.bigNumberify(raw_value),
      data: raw_data,
      v: ethers.utils.bigNumberify(raw_v).toNumber(),
      r: raw_r,
      s: raw_s
    }

    if (tx.to === '0x') {
      delete tx.to
    }
    return { tx }
  } catch (err) {
    return {
      error: `${err.code} ${err.reason}`
    }
  }
}

export const ethTxToHex = tx => {
  const nilHex = '0x0'
  return ethers.utils.RLP.encode([
    propOr(nilHex, 'nonce', tx),
    propOr(nilHex, 'gasPrice', tx),
    propOr(nilHex, 'gas', tx),
    propOr(nilHex, 'to', tx),
    propOr(nilHex, 'value', tx),
    propOr(nilHex, 'input', tx),
    propOr(nilHex, 'v', tx),
    propOr(nilHex, 'r', tx),
    propOr(nilHex, 's', tx)
  ])
}

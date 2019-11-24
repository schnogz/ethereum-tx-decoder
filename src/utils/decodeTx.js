import { ethers } from 'ethers'

export const decodeTx = raw_tx => {
  try {
    const decoded_tx = ethers.utils.RLP.decode(raw_tx)
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
    ] = decoded_tx

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
    return { err }
  }
}

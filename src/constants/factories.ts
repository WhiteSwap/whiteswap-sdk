import { ChainId } from '../types'

export const FACTORY_ADDRESS: Record<ChainId, string> = {
  [ChainId.MAINNET]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.GOERLI]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.POLYGON]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.POLYGON_MUMBAI]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.MAINNET_TRON_GRID]: 'TZENwkSudHRjeufNrQYAPtCmcuNRw2HNYT',
  // FIXME: add shasta factory address
  [ChainId.TESTNET_SHASTA]: 'TZENwkSudHRjeufNrQYAPtCmcuNRw2HNYT'
}

export const INIT_CODE_HASH = {
  [ChainId.MAINNET]: '0xfad2a9a251fff38151d87d2aa4e39e75ad40feabd873069329d3c31ab9afe018',
  [ChainId.GOERLI]: '0x35d4ee2325cb088a33ff62bba214e18d081ac8c842c7a997520a5bc1ee317b9d',
  [ChainId.POLYGON]: '0x7191ce262e831732e5124709cc335a6f0586f035789478995da659d8cb14a8fd',
  [ChainId.POLYGON_MUMBAI]: '0x7191ce262e831732e5124709cc335a6f0586f035789478995da659d8cb14a8fd',
  // FIXME: add correct mainnet init code hash
  [ChainId.MAINNET_TRON_GRID]: '6f1790cd728d037cb59ceff3aa95d3b7fbb64f95c8b547db7d74f9c22fb90f33',
  // FIXME: add correct testnet shasta init code hash
  [ChainId.TESTNET_SHASTA]: '6f1790cd728d037cb59ceff3aa95d3b7fbb64f95c8b547db7d74f9c22fb90f33'
}

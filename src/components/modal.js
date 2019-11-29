import React from 'react'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { makeStyles } from '@material-ui/core/styles'
import { Backdrop, Button, Fade, Modal } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: '14px'
  },
  modalEthAddr: {
    fontSize: '11px',
    margin: '12px 0'
  }
}))

export default props => {
  const classes = useStyles()

  return (
    <Modal
      className={classes.modal}
      open={props.isModalOpen}
      onClose={() => props.setIsModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={props.isModalOpen}>
        <div className={classes.modalContent}>
          <QRCode size={200} value={props.ethDonateAddr} />
          <div className={classes.modalEthAddr}>{props.ethDonateAddr}</div>
          <CopyToClipboard onCopy={() => props.setIsEthAddrCopied(true)} text={props.ethDonateAddr}>
            <Button color='primary' size='small' variant='contained'>
              Copy Address
            </Button>
          </CopyToClipboard>
        </div>
      </Fade>
    </Modal>
  )
}

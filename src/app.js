import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Fade,
  IconButton,
  Modal,
  MuiThemeProvider,
  Paper,
  Snackbar,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core'

import { fetchEthTxByHash } from './utils/api'
import { decodeEthHexTx, ethTxToHex } from './utils/eth'
import { darkTheme, lightTheme } from './theme'

const useStyles = makeStyles(theme => ({
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  button: {
    width: '300px',
    marginTop: '10px',
    marginBottom: '20px'
  },
  copyButton: {
    width: '125px'
  },
  copyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '15px'
  },
  error: {
    color: '#FF647C',
    fontSize: '11px',
    marginTop: '-4px'
  },
  errorIcon: {
    color: '#FF647C',
    fontSize: '50px',
    margin: '10px auto 5px'
  },
  errorText: {
    color: '#FF647C',
    fontSize: '20px'
  },
  form: {
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
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
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: '30px 20px',
    width: '100%'
  },
  dataOverviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '220px',
    marginRight: '25px'
  },
  dataRespContainer: {
    overflowX: 'scroll',
    padding: '10px',
    flexGrow: 2
  },
  mainContainer: {
    paddingTop: '15px'
  },
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center'
  },
  snackbarIcon: {
    color: '#139a62',
    marginRight: '8px'
  }
}))

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export default () => {
  const classes = useStyles()
  const [unrecognizedInput, setUnrecognizedInput] = useState(false)
  const [txOverview, setTxOverview] = useState(null)
  const [txHex, setTxHex] = useState(null)
  const [decodedTx, setTx] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDataCopied, setIsDataCopied] = React.useState(false)
  const [isEthAddrCopied, setIsEthAddrCopied] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const ethDonateAddr = '0xb3AfF6C7d10BdD704E3B44f74974208C34BAD7de'

  const onSubmit = values => {
    setUnrecognizedInput(false)
    setTx(null)
    setTxHex(null)
    setTxOverview(null)
    fetchEthTxByHash(values.rawTxOrTxHex)
      .then(res => {
        res.json().then(data => {
          // check for valid tx hash
          if (data.error) {
            // invalid tx hash
            const txHex = decodeEthHexTx(values.rawTxOrTxHex)
            if (txHex.error) {
              // invalid tx hash and tx hex
              return setUnrecognizedInput(true)
            } else {
              // valid tx hex
              setTxHex({
                error: 'ETH transaction hash not detected'
              })
              setTx(decodeEthHexTx(values.rawTxOrTxHex))
            }
          } else {
            // valid tx hash
            const rawTxHex = ethTxToHex(data.result)
            setTxOverview(data.result)
            setTxHex(rawTxHex)
            setTx(decodeEthHexTx(rawTxHex))
          }
        })
      })
      .catch(() => {
        setTxHex(null)
        setTx(null)
      })
  }
  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Ethereum Transaction Decoder</Typography>
          <div className={classes.grow} />
          <IconButton
            aria-label='Toggle dark/light modes'
            color='inherit'
            title='Toggle dark/light modes'
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Button
            color='secondary'
            onClick={() => setIsModalOpen(true)}
            variant='contained'
            size='small'
            style={{ marginLeft: '10px' }}
          >
            Donate ETH
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.mainContainer} maxWidth='lg'>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, valid }) => (
            <Box className={classes.box}>
              <form onSubmit={handleSubmit} className={classes.form}>
                <Field
                  name='rawTxOrTxHex'
                  validate={composeValidators(value => (value ? undefined : '* Required Field'))}
                >
                  {({ input, meta }) => (
                    <div>
                      <TextField
                        {...input}
                        className={classes.form}
                        label='Enter Ethereum Tx Hash or Raw Tx Hex'
                        placeholder='Enter Ethereum Tx Hash or Raw Tx Hex'
                        margin='normal'
                        variant='outlined'
                      />
                      {meta.error && meta.touched && (
                        <div className={classes.error} color='error'>
                          {meta.error}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
                <Box className={classes.box}>
                  <Button
                    type='submit'
                    disabled={submitting || !valid}
                    size='large'
                    variant='contained'
                    color='primary'
                    className={classes.button}
                  >
                    Decode Transaction
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        />
        {unrecognizedInput && (
          <>
            <Divider variant='middle' />
            <Box className={classes.box}>
              <div className={classes.dataOverviewContainer}>
                <ErrorIcon className={classes.errorIcon} />
                <Typography variant='h6' className={classes.errorText}>
                  Input is not a valid Ethereum transaction hash or raw transaction hex!
                </Typography>
              </div>
            </Box>
          </>
        )}
        {txOverview && (
          <>
            <Divider variant='middle' />
            <Box className={classes.box}>
              <div className={classes.dataContainer}>
                <div className={classes.dataOverviewContainer}>
                  <Typography variant='h6'>Tx Overview</Typography>
                  <CopyToClipboard
                    onCopy={() => setIsDataCopied(true)}
                    text={JSON.stringify(txOverview)}
                  >
                    <Button color='secondary' className={classes.copyButton} variant='contained'>
                      Copy Data
                    </Button>
                  </CopyToClipboard>
                </div>
                <Paper className={classes.dataRespContainer}>
                  <pre>{JSON.stringify(txOverview, 0, 2)}</pre>
                </Paper>
              </div>
            </Box>
          </>
        )}
        {txHex && (
          <>
            <Divider variant='middle' />
            <Box className={classes.box}>
              <div className={classes.dataContainer}>
                <div className={classes.dataOverviewContainer}>
                  <Typography variant='h6'>Raw Tx Hex</Typography>
                  <CopyToClipboard
                    onCopy={() => setIsDataCopied(true)}
                    text={JSON.stringify(txHex)}
                  >
                    <Button color='secondary' className={classes.copyButton} variant='contained'>
                      Copy Data
                    </Button>
                  </CopyToClipboard>
                </div>
                <Paper className={classes.dataRespContainer}>
                  <pre>{JSON.stringify(txHex, 0, 2)}</pre>
                </Paper>
              </div>
            </Box>
          </>
        )}
        {decodedTx && (
          <>
            <Divider variant='middle' />
            <Box className={classes.box}>
              <div className={classes.dataContainer}>
                <div className={classes.dataOverviewContainer}>
                  <Typography variant='h6'>Raw Tx Hex Decoded</Typography>
                  {decodedTx.tx && (
                    <CopyToClipboard
                      onCopy={() => setIsDataCopied(true)}
                      text={JSON.stringify(decodedTx.tx)}
                    >
                      <Button color='secondary' className={classes.copyButton} variant='contained'>
                        Copy Data
                      </Button>
                    </CopyToClipboard>
                  )}
                </div>
                <Paper className={classes.dataRespContainer}>
                  <pre>{JSON.stringify(decodedTx.tx ? decodedTx.tx : decodedTx, 0, 2)}</pre>
                </Paper>
              </div>
            </Box>
          </>
        )}
        <div className={classes.grow} />
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={1500}
        className={classes.snackbar}
        open={isDataCopied || isEthAddrCopied}
        onClose={() => {
          setIsDataCopied(false)
          setIsEthAddrCopied(false)
        }}
        message={
          <span className={classes.snackbarMessage}>
            <CheckCircleIcon className={classes.snackbarIcon} />
            Data copied!
          </span>
        }
      />
      <Modal
        className={classes.modal}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isModalOpen}>
          <div className={classes.modalContent}>
            <QRCode size={200} value={ethDonateAddr} />
            <div className={classes.modalEthAddr}>{ethDonateAddr}</div>
            <CopyToClipboard onCopy={() => setIsEthAddrCopied(true)} text={ethDonateAddr}>
              <Button size='small' color='primary' variant='contained'>
                Copy Address
              </Button>
            </CopyToClipboard>
          </div>
        </Fade>
      </Modal>
    </MuiThemeProvider>
  )
}

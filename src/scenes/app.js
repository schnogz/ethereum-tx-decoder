import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import queryString from 'query-string'

import ErrorIcon from '@material-ui/icons/Error'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  MuiThemeProvider,
  TextField,
  Typography
} from '@material-ui/core'

import { fetchEthTxByHash } from '../utils/api'
import { decodeEthHexTx, ethTxToHex } from '../utils/eth'
import { darkTheme, lightTheme } from '../components/theme'
import { Alerts, DataSection, Header, Modal } from '../components'

const useStyles = makeStyles(() => ({
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    color: 'white'
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
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '220px',
    marginRight: '25px'
  },
  form: {
    width: '100%'
  },
  mainContainer: {
    paddingTop: '15px'
  },
  submitButton: {
    width: '300px',
    marginTop: '10px',
    marginBottom: '20px'
  }
}))

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export default () => {
  const classes = useStyles()
  const [searchInput, setSearchInput] = useState('')
  const [unrecognizedInput, setUnrecognizedInput] = useState(false)
  const [txOverview, setTxOverview] = useState(null)
  const [txHex, setTxHex] = useState(null)
  const [decodedTx, setTx] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDataCopied, setIsDataCopied] = React.useState(false)
  const [isEthAddrCopied, setIsEthAddrCopied] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const ethDonateAddr = '0xb3AfF6C7d10BdD704E3B44f74974208C34BAD7de'

  // check query string for search
  useEffect(() => {
    const { search } = queryString.parse(window.location.search)
    if (search && searchInput !== search) {
      onSubmit({ search })
    }
  })

  const onSubmit = values => {
    setSearchInput(values.search)
    setUnrecognizedInput(false)
    setTx(null)
    setTxHex(null)
    setTxOverview(null)
    fetchEthTxByHash(values.search)
      .then(res => {
        res.json().then(data => {
          // check for valid tx hash
          if (data.error) {
            // invalid tx hash
            const txHex = decodeEthHexTx(values.search)
            if (txHex.error) {
              // invalid tx hash and tx hex
              return setUnrecognizedInput(true)
            } else {
              // valid tx hex
              setTxHex({
                error: 'ETH transaction hash not detected'
              })
              setTx(decodeEthHexTx(values.search))
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

    // update url
    const url = window.location.origin + `?search=${values.search}`
    window.history.pushState({ path: url }, '', url)
  }
  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsModalOpen={setIsModalOpen}
      />
      <Container className={classes.mainContainer} maxWidth='lg'>
        <Form
          initialValues={{
            search: searchInput
          }}
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, valid }) => (
            <Box className={classes.box}>
              <form onSubmit={handleSubmit} className={classes.form} id='form'>
                <Field
                  name='search'
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
                        id='test'
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
                    className={classes.submitButton}
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
              <div className={classes.errorContainer}>
                <ErrorIcon className={classes.errorIcon} />
                <Typography variant='h6' className={classes.errorText}>
                  Input is not a valid Ethereum transaction hash or raw transaction hex!
                </Typography>
              </div>
            </Box>
          </>
        )}
        {txOverview && (
          <DataSection data={txOverview} setIsDataCopied={setIsDataCopied} title='Tx Overview' />
        )}
        {txHex && <DataSection data={txHex} setIsDataCopied={setIsDataCopied} title='Raw Tx Hex' />}
        {decodedTx && (
          <DataSection
            data={decodedTx.tx ? decodedTx.tx : decodedTx}
            setIsDataCopied={setIsDataCopied}
            title='Raw Tx Hex Decoded'
          />
        )}
      </Container>
      <Alerts
        isDataCopied={isDataCopied}
        isEthAddrCopied={isEthAddrCopied}
        setIsDataCopied={setIsDataCopied}
        setIsEthAddrCopied={setIsEthAddrCopied}
      />
      <Modal
        isModalOpen={isModalOpen}
        ethDonateAddr={ethDonateAddr}
        setIsEthAddrCopied={setIsEthAddrCopied}
        setIsModalOpen={setIsModalOpen}
      />
    </MuiThemeProvider>
  )
}

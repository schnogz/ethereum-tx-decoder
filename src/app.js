import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Fab,
  IconButton,
  MuiThemeProvider,
  Paper,
  Snackbar,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core'

import { decodeTx } from './utils/decodeTx'
import { darkTheme, lightTheme } from './theme'

const useStyles = makeStyles(theme => ({
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '300px',
    marginTop: '10px',
    marginBottom: '20px'
  },
  copyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '15px'
  },
  donate: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  error: {
    color: '#FF647C',
    fontSize: '11px',
    marginTop: '-4px'
  },
  grow: {
    flexGrow: 1
  },
  paper: {
    marginTop: '20px',
    overflowX: 'scroll',
    padding: '10px',
    width: '800px'
  },
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center'
  },
  snackbarIcon: {
    color: '#139a62',
    marginRight: '8px'
  },
  textField: {
    width: '800px'
  }
}))

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)
const required = value => (value ? undefined : '* Required')

export default () => {
  const classes = useStyles()
  const [decodedTx, setTx] = useState()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [dataCopied, setDataCopied] = React.useState(false)

  const onSubmit = values => {
    setTx(decodeTx(values.rawTx))
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
        </Toolbar>
      </AppBar>
      <Container maxWidth='md'>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, valid }) => (
            <Box className={classes.box}>
              <form onSubmit={handleSubmit}>
                <Field name='rawTx' validate={composeValidators(required)}>
                  {({ input, meta }) => (
                    <div>
                      <TextField
                        {...input}
                        className={classes.textField}
                        label='Raw Hex'
                        multiline
                        rows='3'
                        placeholder='Enter raw transaction hex'
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
        {decodedTx && (
          <>
            <Divider variant='middle' />
            <Box className={classes.box}>
              <Paper className={classes.paper}>
                <pre>{JSON.stringify(decodedTx.tx ? decodedTx.tx : decodedTx.err, 0, 2)}</pre>
              </Paper>
            </Box>
            <Box className={classes.copyContainer}>
              <CopyToClipboard
                onCopy={() => setDataCopied(true)}
                text={JSON.stringify(decodedTx.tx ? decodedTx.tx : decodedTx.err)}
              >
                <Button color='secondary' variant='contained'>
                  Copy
                </Button>
              </CopyToClipboard>
            </Box>
          </>
        )}
        <div className={classes.grow} />
      </Container>
      <div className={classes.donate}>
        <Fab color='secondary' variant='extended' size='small'>
          Donate ETH
        </Fab>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={1500}
        className={classes.snackbar}
        open={dataCopied}
        onClose={() => setDataCopied(false)}
        message={
          <span className={classes.snackbarMessage}>
            <CheckCircleIcon className={classes.snackbarIcon} />
            Data copied!
          </span>
        }
      />
    </MuiThemeProvider>
  )
}

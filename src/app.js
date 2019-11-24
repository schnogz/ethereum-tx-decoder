import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar ,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  MuiThemeProvider,
  Paper,
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
  grow: {
    flexGrow: 1
  },
  paper: {
    marginTop: '20px',
    padding: '10px',
    width: '800px'
  },
  textField: {
    width: '800px'
  }
}))

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)
const required = value => (value ? undefined : 'Required')

export default () => {
  const classes = useStyles()
  const [tx, setTx] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false)
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
            {isDarkMode ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div>
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
                          rows='4'
                          placeholder='Enter raw transaction hex'
                          margin='normal'
                          variant='outlined'
                        />
                        {meta.error && meta.touched && <span>{meta.error}</span>}
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
          {tx && (
            <>
              <Divider variant='middle' />
              <Box className={classes.box}>
                <Paper className={classes.paper}>
                  <pre>{JSON.stringify(tx, 0, 2)}</pre>
                </Paper>
              </Box>
            </>
          )}
        </Container>
      </div>
    </MuiThemeProvider>
  )
}

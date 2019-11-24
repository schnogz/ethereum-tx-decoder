import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Paper,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Field, Form } from 'react-final-form'

import { decodeTx } from './utils/decodeTx'

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
  const onSubmit = values => {
    let decodedTx = decodeTx(values.rawTx)
    setTx(decodedTx)
  }
  return (
    <>
      <CssBaseline />
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Ethereum Transaction Decoder</Typography>
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
    </>
  )
}

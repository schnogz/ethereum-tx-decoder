import React from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
  textField: {
    width: '800px'
  }
}))

export default () => {
  const classes = useStyles()
  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Ethereum Tx Decoder</Typography>
        </Toolbar>
      </AppBar>
      <div>
        <Container maxWidth='md'>
          <Box className={classes.box}>
            <form autoComplete='off'>
              <TextField
                className={classes.textField}
                id='outlined-multiline-static'
                label='Raw TX'
                multiline
                rows='4'
                placeholder='Enter raw TX'
                margin='normal'
                variant='outlined'
                required
              />
              <Box className={classes.box}>
                <Button size='large' variant='contained' color='primary' className={classes.button}>
                  Decode Transaction
                </Button>
              </Box>
            </form>
          </Box>
          <Divider variant='middle' />
        </Container>
      </div>
    </>
  )
}

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1
  }
}))

export default props => {
  const classes = useStyles()

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Ethereum Transaction Decoder</Typography>
        <div className={classes.grow} />
        <IconButton
          aria-label='Toggle dark/light modes'
          color='inherit'
          title='Toggle dark/light modes'
          onClick={() => props.setIsDarkMode(!props.isDarkMode)}
        >
          {props.isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button
          color='secondary'
          onClick={() => props.setIsModalOpen(true)}
          variant='contained'
          size='small'
          style={{ marginLeft: '10px' }}
        >
          Donate ETH
        </Button>
      </Toolbar>
    </AppBar>
  )
}

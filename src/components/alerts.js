import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Snackbar } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

const useStyles = makeStyles(() => ({
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center'
  },
  snackbarIcon: {
    color: '#139a62',
    marginRight: '8px'
  }
}))

export default props => {
  const classes = useStyles()

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={1500}
      className={classes.snackbar}
      open={props.isDataCopied || props.isEthAddrCopied}
      onClose={() => {
        props.setIsDataCopied(false)
        props.setIsEthAddrCopied(false)
      }}
      message={
        <span className={classes.snackbarMessage}>
          <CheckCircleIcon className={classes.snackbarIcon} />
          Data copied!
        </span>
      }
    />
  )
}

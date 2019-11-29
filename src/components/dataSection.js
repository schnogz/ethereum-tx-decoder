import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Divider, Paper, Typography } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  copyButton: {
    width: '125px'
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
  }
}))

export default props => {
  const classes = useStyles()

  return (
    <>
      <Divider variant='middle' />
      <Box className={classes.box}>
        <div className={classes.dataContainer}>
          <div className={classes.dataOverviewContainer}>
            <Typography variant='h6'>{props.title}</Typography>
            <CopyToClipboard
              onCopy={() => props.setIsDataCopied(true)}
              text={JSON.stringify(props.data)}
            >
              <Button color='secondary' className={classes.copyButton} variant='contained'>
                Copy Data
              </Button>
            </CopyToClipboard>
          </div>
          <Paper className={classes.dataRespContainer}>
            <pre>{JSON.stringify(props.data, 0, 2)}</pre>
          </Paper>
        </div>
      </Box>
    </>
  )
}

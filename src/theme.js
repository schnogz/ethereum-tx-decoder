import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  palette: {
    background: {
      paper: '#fff',
      default: '#fff'
    },
    type: 'light',
    primary: {
      dark: '#3F3356',
      light: '#A5AFFB',
      main: '#6979F8'
    },
    secondary: {
      main: '#47E8A4',
      light: '#AFFCDC'
    },
    error: {
      main: '#FF647C',
      light: '#FDAFBB'
    },
    darkestGray: '#969494',
    darkGray: '#BABABA',
    mediumGray: '#E8E5EA',
    lightGray: '#ECEBED'
  },
  overrides: {
    MuiButton: {
      contained: {
        '&:disabled': {
          backgroundColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
      outlinedPrimary: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2
        }
      }
    },
    MuiFormLabel: {
      root: {
        fontWeight: 500
      }
    },
    MuiInputBase: {
      root: {
        backgroundColor: '#fff',
        borderRadius: 4
      }
    }
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  }
})

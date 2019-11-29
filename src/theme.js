import { createMuiTheme } from '@material-ui/core/styles'

const typography = {
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

export const lightTheme = createMuiTheme({
  palette: {
    background: {
      paper: '#fff',
      default: '#fff'
    },
    type: 'light',
    primary: {
      dark: '#3F3356',
      main: '#6979F8'
    },
    secondary: {
      dark: '#118856',
      main: '#139a62'
    }
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
    MuiDivider: {
      root: {
        height: '2px'
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
        borderRadius: 4,
        fontSize: '14px'
      }
    },
    MuiPaper: {
      root: {
        fontSize: '14px',
        fontWeight: 500
      }
    },
    MuiTypography: {
      root: {
        color: '#121212'
      }
    }
  },
  typography
})

export const darkTheme = createMuiTheme({
  palette: {
    background: {
      paper: '#333',
      default: '#121212'
    },
    type: 'light',
    primary: {
      dark: '#3F3356',
      main: '#6979F8'
    },
    secondary: {
      dark: '#118856',
      main: '#139a62'
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        '&:disabled': {
          backgroundColor: 'rgba(51, 51, 51, 0.75)',
          color: '#666'
        }
      },
      outlinedPrimary: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2
        }
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#666',
        height: '2px'
      }
    },
    MuiFormLabel: {
      root: {
        fontWeight: 500,
        color: '#fff'
      }
    },
    MuiInputBase: {
      root: {
        backgroundColor: '#333',
        borderRadius: 4,
        fontSize: '14px'
      }
    },
    MuiOutlinedInput: {
      input: {
        color: '#fff'
      }
    },
    MuiPaper: {
      root: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500
      }
    },
    MuiTypography: {
      root: {
        color: '#fff'
      }
    }
  },
  typography
})

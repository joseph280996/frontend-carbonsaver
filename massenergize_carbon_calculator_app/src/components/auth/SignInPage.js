// Functional components import
import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
// Styling Components import
import {
  Grid,
  TextField,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useFormik } from 'formik'
import { useFirebase } from 'react-redux-firebase'

import { useAuthState } from '../context/AuthContext'
import { useSelectedState } from '../context/SelectedContext'
import { facebookProvider, googleProvider } from './firebaseConfig'
import { getUser } from '../../actions'
// Styling classes
const useStyles = makeStyles({
  textInput: {
    width: '100%',
  },
  container: {
    margin: '5vh auto',
    width: '50vh',
    padding: '2vh',
  },
  link: {
    textDecoration: 'none',
  },
  googleBtn: {
    color: 'white',
    backgroundColor: 'red',
  },
  fbBtn: {
    color: 'white',
    backgroundColor: '#3b5998',
  },
  error: {
    color: 'red',
  },
  submitBtn: {
    backgroundColor: '#8dc63f',
    color: 'white',
  },
})

const LogInForm = props => {
  const classes = useStyles()
  const [loading, setLoading] = React.useState()
  const firebase = useFirebase()
  const { authState, setAuthState } = useAuthState()
  const { selected } = useSelectedState()

  // Rendering TextFields for user input
  // For sign in includes email and password

  const signInFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: values => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      normalLogin(values)
    },
    validate: formValues => {
      const errors = {}

      if (!formValues.email) {
        errors.email = 'You Must Enter an Email'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)
      ) {
        errors.email = 'Invalid Email'
      }

      if (!formValues.password) {
        errors.password = 'You Must Enter a Password'
      }

      return errors
    },
  })

  // KNOWN UG : LOGGING IN WITH GOOGLE WILL DELETE ANY ACCOUNT WITH THE SAME PASSWORD:
  // WOULD NOT DELETE DATA I THINK?
  // Sign in with Google function
  const signInWithGoogle = () => {
    // Authentication reset upon closing tab/window
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(googleProvider)
          .then(async googleAuth => {
            // Save user information to backend database
            const user = await getUser(googleAuth.user)
            setAuthState(user)
          })
          .catch(err => {
            setLoading(false)
            signInFormik.setStatus(err.message)
          })
      })
  }
  // Sign In with Facebook function
  const signInWithFacebook = () => {
    // Authentication reset upon closing tab/window
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(facebookProvider)
          .then(async facebookAuth => {
            // Save user information to backend database
            const user = await getUser(facebookAuth.user)
            setAuthState(user)
          })
          .catch(err => {
            setLoading(false)
            signInFormik.setStatus(err.message)
          })
      })
  }

  if (authState) return <Redirect to={`/event/${selected.name}`} />

  // Render Auth Form for user sign in with other options print out
  return (
    <Paper className={classes.container}>
      <Typography variant="h3">
        Please Enter Your Email and Password to Continue
      </Typography>
      <form noValidate autoComplete="off" onSubmit={signInFormik.handleSubmit}>
        {signInFormik.status && (
          <Typography style={{ color: 'red' }}>
            {signInFormik.status}
          </Typography>
        )}
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container style={{ marginTop: '2vh' }} spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  type="email"
                  label="Email"
                  placeholder="email@example.com"
                  margin="normal"
                  className={classes.textInput}
                  name="email"
                  onBlur={signInFormik.handleBlur}
                  onChange={signInFormik.handleChange}
                  value={signInFormik.values.email}
                  helperText={
                    signInFormik.touched.email && signInFormik.errors.email
                  }
                  error={
                    signInFormik.touched.email && signInFormik.errors.email
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textInput}
                  onBlur={signInFormik.handleBlur}
                  onChange={signInFormik.handleChange}
                  value={signInFormik.values.password}
                  helperText={
                    signInFormik.touched.password &&
                    signInFormik.errors.password
                  }
                  error={
                    signInFormik.touched.password &&
                    signInFormik.errors.password
                  }
                  name="password"
                  label="Password"
                  placeholder="Password"
                  variant="outlined"
                  type="password"
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button className={classes.submitBtn} type="submit">
              Sign In
            </Button>
            {loading && (
              <span>
                <CircularProgress />
              </span>
            )}
          </Grid>
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <Button
                onClick={signInWithFacebook}
                id="facebook"
                className={`img-circle facebook ${classes.fbBtn}`}
              >
                <span className="fa fa-facebook-f">Continue with Facebook</span>
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={signInWithGoogle}
                id="google"
                className={`img-circle google ${classes.googleBtn}`}
              >
                <span className="fa fa-google"> Continue with Google</span>
              </Button>
            </Grid>
            <Grid item>
              <Typography>
                Don't have an account?
                <Link className={classes.link} to="/signup">
                  Create a Profile
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                <Link className={classes.link} to="/resetpass">
                  Forgot Your Password?
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
// Connect with signIn and getUser action
export default LogInForm

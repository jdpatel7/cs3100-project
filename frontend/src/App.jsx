import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import './assets/style/Europa.scss';
import './assets/style/BellSlim.scss';
import 'katex/dist/katex.min.css';
import TaskBar from './components/TaskBar';
import SideBar from './components/SideBar';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import PostCreatePage from './components/PostCreatePage';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import RegisterPage from './components/RegisterPage';
import PageBody from './components/PageBody';
import PostViewPage from './components/PostViewPage';
import Error404 from './components/Error404';
import { withCookies } from 'react-cookie';
import {
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
} from '@material-ui/icons';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SnackbarProvider, withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import { backend, debug } from './settings';

export const sideBarDrawerWidth = 240;

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Europa',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      light: '#1565c0',
      main: '#0d47a1',
      dark: '#002171',
    },
    accent: {
      light: '#ff5983',
      main: '#f50057',
      dark: '#bb002f',
    },
    error: {
      light: '#ff6659',
      main: '#d32f2f',
      dark: '#9a0007',
    },
  },
});

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  a: {
    color: '#00B7FF',
  },
  dismissSnackbarText: {
    color: 'white',
  },
});

const TaskBarWithRouter = withRouter(TaskBar);

class AppBody extends Component {
  constructor(props) {
    super(props);
    this.siteLevelItems = [
      this.createSiteLevelItem('Primary', <Filter1 />),
      this.createSiteLevelItem('Elementary', <Filter2 />),
      this.createSiteLevelItem('Intermediate', <Filter3 />),
      this.createSiteLevelItem('Secondary', <Filter4 />),
      this.createSiteLevelItem('Undergraduate', <Filter5 />),
      this.createSiteLevelItem('Graduate', <Filter6 />),
    ];
    this.state = {
      sideBarOpen: false,
      siteLevelIdx: 0,
      showBrand: true,
      fetchedAuth: false,
      isAuthenticated: false,
      isAdmin: false,
      numHubSessionKey: '',
      uid: null,
    };
  }

  createSiteLevelItem = (label, icon) => ({
    label,
    icon,
  });

  updateState = (key, value, callback = () => {}) => {
    this.setState({ [key]: value }, callback);
  };

  getState = (key) => this.state[key];

  getAuthenticated = () => {
    const sessionKey = this.props.cookies.get('numHubSessionKey');
    if (sessionKey && !this.state.isAuthenticated && !this.state.fetchedAuth) {
      const uri = backend ? `//${backend}/api/gatekeeper` : '/api/gatekeeper';
      const data = {
        action: 'auth',
        value: {
          sessionKey,
        },
      };
      const config = {
        timeout: 2000,
        crossOrigin: true,
        withCredentials: true,
      };
      axios
        .post(uri, data, config)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data &&
            response.data.ok === true &&
            'authenticated' in response.data &&
            'admin' in response.data
          ) {
            this.setState({
              numHubSessionKey: sessionKey,
              fetchedAuth: true,
              isAuthenticated: response.data.authenticated,
              isAdmin: response.data.admin,
            });
          } else {
            if (debug) {
              console.log('Error fetching authentication information.');
            }
            this.setState({
              fetchedAuth: true,
            });
          }
        })
        .catch((error) => {
          if (debug) {
            console.log('Error fetching authentication information:', error);
          }
          this.setState({
            fetchedAuth: true,
          });
        });
    }
  };

  componentDidMount() {
    this.getAuthenticated();
  }

  render() {
    const {
      sideBarOpen,
      isAuthenticated,
      isAdmin,
      numHubSessionKey,
    } = this.state;
    const { enqueueSnackbar } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className={'App'}>
            <TaskBarWithRouter
              sideBarOpen={this.state.sideBarOpen}
              globalUpdate={this.updateState}
              numHubSessionKey={numHubSessionKey}
              siteLevelName={this.siteLevelItems[this.state.siteLevelIdx].label}
              authenticated={isAuthenticated}
              admin={isAdmin}
            />
            <PageBody sideBarOpen={sideBarOpen}>
              <Switch>
                <Route
                  path="/"
                  render={withRouter((props) => (
                    <HomePage
                      {...props}
                      numHubSessionKey={numHubSessionKey}
                      levelIdx={this.state.siteLevelIdx}
                      levelName={
                        this.siteLevelItems[this.state.siteLevelIdx].label
                      }
                      enqueueSnackbar={enqueueSnackbar}
                    />
                  ))}
                  exact
                />
                <Route
                  path="/new"
                  render={withRouter((props) => (
                    <PostCreatePage
                      {...props}
                      numHubSessionKey={numHubSessionKey}
                      enqueueSnackbar={enqueueSnackbar}
                      levelIdx={this.state.siteLevelIdx}
                      levelName={
                        this.siteLevelItems[this.state.siteLevelIdx].label
                      }
                      authenticated={isAuthenticated}
                    />
                  ))}
                  exact
                />
                <Route
                  path="/register"
                  render={withRouter((props) => (
                    <RegisterPage
                      {...props}
                      numHubSessionKey={numHubSessionKey}
                      globalUpdate={this.updateState}
                      enqueueSnackbar={enqueueSnackbar}
                      authenticated={isAuthenticated}
                    />
                  ))}
                  exact
                />
                <Route
                  path="/post/:idHash"
                  render={withRouter((props) => (
                    <PostViewPage
                      {...props}
                      numHubSessionKey={numHubSessionKey}
                      globalUpdate={this.updateState}
                      enqueueSnackbar={enqueueSnackbar}
                      authenticated={isAuthenticated}
                    />
                  ))}
                  exact
                />
                <Route
                  path="/login"
                  render={withRouter((props) => (
                    <LoginPage
                      {...props}
                      numHubSessionKey={numHubSessionKey}
                      globalUpdate={this.updateState}
                      enqueueSnackbar={enqueueSnackbar}
                      authenticated={isAuthenticated}
                    />
                  ))}
                  exact
                />
                <Route
                  path="/admin"
                  render={withRouter((props) => (
                    <AdminPage
                      {...props}
                      globalUpdate={this.updateState}
                      enqueueSnackbar={enqueueSnackbar}
                      numHubSessionKey={numHubSessionKey}
                      authenticated={isAuthenticated}
                      admin={isAdmin}
                    />
                  ))}
                  exact
                />
                <Route
                  path="/profile"
                  render={withRouter((props) => (
                    <ProfilePage
                      {...props}
                      globalUpdate={this.updateState}
                      enqueueSnackbar={enqueueSnackbar}
                      numHubSessionKey={numHubSessionKey}
                      authenticated={isAuthenticated}
                    />
                  ))}
                  exact
                />
                <Route
                  render={withRouter((props) => (
                    <Error404 {...props} enqueueSnackbar={enqueueSnackbar} />
                  ))}
                />
              </Switch>
            </PageBody>
            <SideBar
              sideBarOpen={this.state.sideBarOpen}
              siteLevelItems={this.siteLevelItems}
              siteLevelIdx={this.state.siteLevelIdx}
              globalUpdate={this.updateState}
            />
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

AppBody.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const AppWithStyles = withStyles(styles, { withTheme: true })(
  withCookies(AppBody),
);

const AppWithSnackBar = withSnackbar(AppWithStyles);

const App = (props) => {
  const { classes } = props;
  return (
    <SnackbarProvider
      maxSnack={3}
      hideIconVariant={true}
      preventDuplicate
      action={[
        <Button className={classes.dismissSnackbarText} size="small">
          {'GOT IT'}
        </Button>,
      ]}
    >
      <AppWithSnackBar />
    </SnackbarProvider>
  );
};

/*
 * Snack bars can have any of the following in their `options` argument:
 *
 * options =  {
 *   variant: 'default', // one of 'default', 'error', 'success', 'warning', and 'info'
 *   persist: false, // either true or false
 *   preventDuplicate: true, // either true or false
 *   autoHideDuration: 1000, // time in milliseconds before dismissal
 * };
 *
 * this.props.enqueueSnackbar(message, options) returns a unique key. This key can be passed as
 * an argument to this.props.closeSnackbar(key) to close a particular snackbar.
 */

export default withStyles(styles)(App);

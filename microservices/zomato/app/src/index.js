import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RestaurantsSearch} from './ResturantsSearch.js';
import  {Login} from './Login.js';
import  {UsersReview} from './UsersReview';
import  {profilepage} from './profilepage';
import  {ImagesMenuReviews} from './ImagesMenuReviews';
import  {Signup} from './Signup';
import  {Loginscreen} from './Loginscreen';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import IndividualPost from './pages/IndividualPost';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<Nav />
					<Route exact path='/' component={Home} />
					<AuthRoute exact path='/login' component={Login} />
					<AuthRoute exact path='/register' component={Register} />
					<Route exact path='/posts/:postId' component={IndividualPost} />
					{/*
					AuthRoute here does a thing with 
					'<Route	{...rest} render={(props) => user ? <Redirect to='/' /> : <Component {...props} />}/>' in  './util/AuthRoute.js'
					which disable once login then input path such as localhost:3000/register, it will redirect page to home page.
					*/}
				</Container>
			</Router>
		</AuthProvider>
	);
}

export default App;

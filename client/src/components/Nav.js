import React, { useContext, useState } from 'react';
import { Menu, Segment, Button, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function Nav() {
	const { user, logout } = useContext(AuthContext);
	const pathname = window.location.pathname;
	// // ./Login
	// This bunch of lines indicates when you input path in the browser,
	// that will activate the button to 'active'
	const path = pathname === '/' ? 'home' : pathname.substr(1);
	const [activeItem, setActiveItem] = useState(path);

	const handleItemClick = (e, { name }) => setActiveItem(name);

	const nav = user ? (
		<Segment inverted size='big'>
			<Menu inverted pointing secondary>
				<Menu.Item name={user.username} active as={Link} to='/' />

				<Menu.Menu position='right'>
					<Dropdown item text='Language'>
						<Dropdown.Menu>
							<Dropdown.Item>English</Dropdown.Item>
							<Dropdown.Item>Chinese</Dropdown.Item>
							<Dropdown.Item>Spanish</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Menu.Item name='logout' onClick={logout}>
						<Button primary>Logout</Button>
					</Menu.Item>
				</Menu.Menu>
			</Menu>
		</Segment>
	) : (
		<Segment inverted size='big'>
			<Menu inverted pointing secondary>
				<Menu.Item
					name='home'
					active={activeItem === 'home'}
					onClick={handleItemClick}
					as={Link}
					to='/'
				/>

				<Menu.Menu position='right'>
					<Dropdown item text='Language'>
						<Dropdown.Menu>
							<Dropdown.Item>English</Dropdown.Item>
							<Dropdown.Item>Chinese</Dropdown.Item>
							<Dropdown.Item>Spanish</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Menu.Item
						name='login'
						active={activeItem === 'login'}
						onClick={handleItemClick}
						as={Link}
						to='/login'>
						<Button primary>Login</Button>
					</Menu.Item>

					<Menu.Item
						name='register'
						active={activeItem === 'register'}
						onClick={handleItemClick}
						as={Link}
						to='/register'>
						<Button primary>Register</Button>
					</Menu.Item>
				</Menu.Menu>
			</Menu>
		</Segment>
	);

	return nav;
}

export default Nav;

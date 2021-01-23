import AuthWrapper from '../wrappers/AuthWrapper.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const route = {
  path: '',
  component: AuthWrapper,
  children: [
		{ path: "/login", component: Login },
		{ path: "/register", component: Register },
	],
}

export default route
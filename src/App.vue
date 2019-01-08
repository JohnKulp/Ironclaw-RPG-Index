<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link> |
			<template v-if="!this.$store.state.auth.isAuthenticated">
				<router-link to="/login">Login</router-link> |
			</template>
			<template v-else>
				<router-link to="/logout">Logout</router-link> |
			</template>
			<router-link to="/gifts">Gifts</router-link>
		</div>
		<router-view/>
	</div>
</template>

<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>

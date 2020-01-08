<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	watch: {
		$route(to, from) {
			document.title = to.meta.title || 'Three.js';
		},
	},
};
</script>

<style lang="scss">
@import '@/assets/style/screen.scss';
</style>

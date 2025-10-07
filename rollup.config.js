import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.BUILD === 'production';

export default [{
	input: 'js/index.js',
	plugins: [
		resolve(),
		isProduction && terser()
	],
	output: {
		file :'js/bundle.js',
		format: 'iife',
		sourcemap: true,
		compact: true
	}
}];

import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [{
	input: 'js/index.js',
	plugins: [resolve(), terser()],
	output: {
		file :'js/bundle.js',
		format: 'iife',
		sourcemap: true,
		compact: true
	}
}];

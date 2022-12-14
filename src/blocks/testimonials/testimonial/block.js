import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';

const { name } = metadata;
import { testimonialBlockIcon } from '@kadence/icons';
import { __ } from '@wordpress/i18n';

export { metadata, name };

registerBlockType( 'kadence/testimonials', {
	...metadata,
	title   : __( 'Testimonials', 'kadence-blocks' ),
	keywords: [
		__( 'testimonials', 'kadence-blocks' ),
		__( 'rating', 'kadence-blocks' ),
		'KB',
	],
	icon    : {
		src: testimonialBlockIcon,
	},
	edit,
	save
} );

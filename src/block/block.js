/**
 * BLOCK: tpd-read-more-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

//  Import CSS.
import './editor.scss';
import './style.scss';

import Edit from './edit'

registerBlockType( 'tpd/block-tpd-read-more-block', {
	
	title: __( 'Read More' ),
	icon: 'plus',
	category: 'common',
	keywords: [
		__( 'Read More' ),
	],
	attributes: {
		id: {
			type: 'number',
		},
		readMoreText: {
			type: 'string',
			default: 'Also Read:'
		},
		title: {
			type: 'string',
		},
		titleChanged: {
			type: 'boolean',
			default: false
		},
		imageID: {
			type: 'number'
		},
		image: {
			type: 'string',
		},
		link: {
			type: 'string',
		},
		isModalOpen: {
			type:  'boolean',
			default: false
		},
		showThumbnail: {
			type: 'boolean',
			default: true
		}
	},

	edit: Edit,

	save: () => {
		return null
	},

} );

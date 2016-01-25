/**
 * External dependencies
 */
import Joi from 'joi-browser';

const logo = Joi.object().keys( {
	id: Joi.number().integer(),
	sizes: Joi.array(),
	url: Joi.string().allow( '' )
} );

const capabilities = Joi.object().pattern( /[a-z_]+/, Joi.boolean() );

const plan = Joi.object().keys( {
	product_id: Joi.number().integer(),
	product_slug: Joi.string().allow( '' ),
	product_name_short: Joi.string().allow( '' ),
	free_trial: Joi.boolean()
} );

const icon = Joi.object().keys( {
	ico: Joi.string().allow( '' ).optional(),
	img: Joi.string().allow( '' ).optional()
} );

const item = Joi.object().keys( {
	ID: Joi.number().integer().required(),
	URL: Joi.string().allow( '' ).optional(),
	capabilities: capabilities.optional(),
	description: Joi.string().allow( '' ).optional(),
	domain: Joi.string().allow( '' ).optional(),
	icon: icon.optional(),
	is_following: Joi.boolean().optional(),
	is_multisite: Joi.boolean().optional(),
	is_private: Joi.boolean().optional(),
	is_vip: Joi.boolean().optional(),
	jetpack: Joi.boolean().optional(),
	lang: Joi.string().min( 2 ).optional(),
	logo: logo.optional(),
	meta: Joi.object().optional(),
	name: Joi.string().min( 1 ).required(),
	options: Joi.object().optional(),
	periodEnd: Joi.string().allow( '' ).optional(),
	plan: plan.required().optional(),
	post_count: Joi.number().integer().optional(),
	primary: Joi.boolean().optional(),
	settings: Joi.object().optional(),
	single_user_site: Joi.boolean().optional(),
	slug: Joi.string().allow( '' ).optional(),
	subscribers_count: Joi.number().integer().optional(),
	title: Joi.string().allow( '' ).optional(),
	user_can_manage: Joi.boolean().optional(),
	visible: Joi.boolean().optional(),
	wpcom_url: Joi.string().allow( '' ).optional()
} );

const schema = Joi.object().pattern( /\d+/, item );

export default schema;

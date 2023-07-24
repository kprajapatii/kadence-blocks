/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, TextareaControl, Button, SelectControl, Dashicon, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { KadencePanelBody, InspectorControlTabs, ResponsiveRangeControls, FormInputControl, SelectParentBlock } from '@kadence/components';
import {
	useEffect,
	useState,
	useMemo,
} from '@wordpress/element';
import {
	getUniqueId,
	getPreviewSize,
} from '@kadence/helpers';
import classNames from 'classnames';
import { DuplicateField, FieldBlockAppender, FieldName } from '../../components';
import { times, filter } from 'lodash';
import { plus } from '@wordpress/icons';

function FieldRadio( { attributes, setAttributes, isSelected, clientId, context, name } ) {
	const { uniqueID, required, label, showLabel, options, defaultValue, helpText, ariaDescription, maxWidth, maxWidthUnit, minWidth, minWidthUnit, defaultParameter, placeholder, auto, inputName, requiredMessage, kadenceDynamic } = attributes;

	const [ rerender, setRerender ] = useState( 0 );
	const [ activeTab, setActiveTab ] = useState( 'general' );
	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID   : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ],
	);

	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );
	const previewMaxWidth = getPreviewSize( previewDevice, ( maxWidth && maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( maxWidth && maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( maxWidth && maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) );
	const previewMinWidth = getPreviewSize( previewDevice, ( minWidth && minWidth[ 0 ] ? minWidth[ 0 ] : '' ), ( minWidth && minWidth[ 1 ] ? minWidth[ 1 ] : '' ), ( minWidth && minWidth[ 2 ] ? minWidth[ 2 ] : '' ) );
	const classes = classNames( {
		'kb-adv-form-field': true,
	} );
	const blockProps = useBlockProps( {
		className: classes,
		style    : {
			maxWidth: '' !== previewMaxWidth ? previewMaxWidth + ( maxWidthUnit ? maxWidthUnit : '%' ) : undefined,
			minWidth: '' !== previewMinWidth ? previewMinWidth + ( minWidthUnit ? minWidthUnit : 'px' ) : undefined,
		},
	} );
	const defaultPreview = useMemo( () => {
		if ( undefined !== kadenceDynamic && undefined !== kadenceDynamic[ 'defaultValue' ] && undefined !== kadenceDynamic[ 'defaultValue' ]?.enable && '' !== kadenceDynamic[ 'defaultValue' ].enable && true === kadenceDynamic[ 'defaultValue' ].enable ) {
			return kadenceDynamic?.[ 'defaultValue' ]?.field ? '{' + kadenceDynamic[ 'defaultValue' ].field + '}' : '';
		}
		return attributes?.defaultValue ? attributes.defaultValue : '';
	}, [ kadenceDynamic, defaultValue ] );

	const onOptionMoveUp = ( oldIndex ) => {
		if ( oldIndex === 0 ) {
			return;
		}
		onOptionMove( oldIndex, oldIndex - 1 );
	};

	const onOptionMoveDown = ( oldIndex ) => {
		if ( oldIndex === options.length - 1 ) {
			return;
		}
		onOptionMove( oldIndex, oldIndex + 1 );
	};

	const onOptionMove = ( oldIndex, newIndex ) => {
		if ( !options ) {
			return;
		}

		let tmpValue = options[ newIndex ];

		options.splice( newIndex, 1, options[ oldIndex ] );
		options.splice( oldIndex, 1, tmpValue );

		setAttributes( { options: options } );
		setRerender( Math.random() );
	};

	const removeOptionItem = ( previousIndex ) => {
		const amount = Math.abs( options.length );
		if ( amount === 1 ) {
			return;
		}
		const newOptions = filter( options, ( item, i ) => previousIndex !== i );
		setAttributes( { options: newOptions } );
	};

	const removeSelection = () => {
		let newOptions = options;

		newOptions.forEach( function( item, index ) {
			item.selected = false;
		} );

		setAttributes( { options: newOptions } );
	};

	const toggleSelected = ( index, value ) => {
		const previousValue = options[ index ].selected;

		removeSelection();

		updateOption( index, { selected: !previousValue } );
	};

	const updateOption = ( index, value ) => {
		const newOptions = options.map( ( item, iteration ) => {
			if ( index === iteration ) {
				item = { ...item, ...value };
			}
			return item;
		} );

		setAttributes( {
			options: newOptions,
		} );
	};

	return (
		<>
			<style>
				{isSelected && (
					<>
						{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }`};
					</>
				)}
			</style>
			<div {...blockProps}>
				<InspectorControls>
					<SelectParentBlock
						label={ __( 'View Form Settings', 'kadence-blocks' ) }
						clientId={ clientId }
						parentSlug={ 'kadence/advanced-form' }
					/>
					<InspectorControlTabs
						panelName={'advanced-form-text-general'}
						setActiveTab={ ( value ) => setActiveTab( value ) }
						activeTab={ activeTab }
						allowedTabs={ [ 'general', 'advanced' ] }
					/>
					{ ( activeTab === 'general' ) &&
						<>
							<KadencePanelBody
								title={ __('Radio Options', 'kadence-blocks') }
								initialOpen={ true }
								panelName={ 'kb-adv-form-radio-options' }
							>
								<div className="kb-adv-field-options-wrap">
									{times( options.length, n => (
										<div key={n} className="kb-adv-field-option">
											<TextControl
												className={'kb-option-text-control'}
												label={__( 'Option', 'kadence-blocks' ) + ' ' + ( n + 1 ) + ' ' + __( 'label', 'kadence-blocks') }
												placeholder={__( 'Option', 'kadence-blocks' )}
												value={( undefined !== options[ n ].label ? options[ n ].label : '' )}
												onChange={( text ) => updateOption( n, { label: text } )}
											/>
											<TextControl
												label={__( 'Option', 'kadence-blocks' ) + ' ' + ( n + 1 ) + ' ' + __( 'value', 'kadence-blocks') }
												placeholder={options[ n ].label}
												value={( undefined !== options[ n ].value ? options[ n ].value : '' )}
												onChange={( text ) => updateOption( n, { value: text } )}
											/>
											<div className="kadence-blocks-list-item__control-menu">
												<Button
													icon="arrow-up"
													onClick={() => ( n === 0 ? undefined : onOptionMoveUp( n ) )}
													className="kadence-blocks-list-item__move-up"
													label={__( 'Move Item Up' )}
													aria-disabled={n === 0}
													disabled={n === 0}
												/>
												<Button
													icon="arrow-down"
													onClick={() => ( ( n + 1 ) === options.length ? undefined : onOptionMoveDown( n ) )}
													className="kadence-blocks-list-item__move-down"
													label={__( 'Move Item Down' )}
													aria-disabled={( n + 1 ) === options.length}
													disabled={( n + 1 ) === options.length}
												/>
												<Button
													icon="no-alt"
													onClick={() => removeOptionItem( n )}
													className="kadence-blocks-list-item__remove"
													label={__( 'Remove Item' )}
													disabled={1 === options.length}
												/>
											</div>
										</div>
									) )}
								</div>
								<Button
									className="kb-add-option"
									variant="primary"
									icon={ plus }
									onClick={() => {
										let newOptions = options;
										newOptions.push( {
											value: '',
											label: '',
										} );
										setAttributes( { options: newOptions } );
										setRerender( Math.random() );
									}}
								>
									{__( 'Add Option', 'kadence-blocks' )}
								</Button>
							</KadencePanelBody>
							<KadencePanelBody
								title={__( 'Field Controls', 'kadence-blocks' )}
								initialOpen={false}
								panelName={ 'kb-adv-form-radio-controls' }
							>
								<ToggleControl
									label={__( 'Required', 'kadence-blocks' )}
									checked={required}
									onChange={( value ) => setAttributes( { required: value } )}
								/>
								<TextControl
									label={__( 'Field Label', 'kadence-blocks' )}
									value={label}
									onChange={( value ) => setAttributes( { label: value } )}
								/>
								<ToggleControl
									label={__( 'Show Label', 'kadence-blocks' )}
									checked={showLabel}
									onChange={( value ) => setAttributes( { showLabel: value } )}
								/>
								<TextareaControl
									label={__( 'Description', 'kadence-blocks' )}
									help={ __( 'This will be displayed under the input and can be used to provide direction on how the field should be filled out.', 'kadence-blocks' )}
									value={helpText}
									onChange={( value ) => setAttributes( { helpText: value } )}
								/>
								<TextControl
									label={__( 'Field Placeholder', 'kadence-blocks' )}
									value={placeholder}
									onChange={( value ) => setAttributes( { placeholder: value } )}
								/>
								<FormInputControl
									label={__( 'Default Value', 'kadence-blocks' )}
									value={defaultValue}
									preview={ defaultPreview }
									onChange={( value ) => setAttributes( { defaultValue: value } )}
									dynamicAttribute={'defaultValue'}
									allowClear={true}
									isSelected={ isSelected }
									attributes={ attributes }
									setAttributes={ setAttributes }
									name={ name }
									clientId={ clientId }
									context={ context }
								/>
							</KadencePanelBody>
						</>
					}
					{ ( activeTab === 'advanced' ) &&
						<>
							<KadencePanelBody
								title={__( 'Field Width', 'kadence-blocks' )}
								initialOpen={true}
								panelName={ 'kb-adv-form-radui-width' }
							>
								<ResponsiveRangeControls
									label={__( 'Max Width', 'kadence-blocks' )}
									value={( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' )}
									onChange={value => {
										setAttributes( { maxWidth: [ value, ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
									}}
									tabletValue={( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' )}
									onChangeTablet={( value ) => {
										setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), value, ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
									}}
									mobileValue={( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' )}
									onChangeMobile={( value ) => {
										setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), value ] } );
									}}
									min={0}
									max={( maxWidthUnit === 'px' ? 2000 : 100 )}
									step={1}
									unit={maxWidthUnit ? maxWidthUnit : '%'}
									onUnit={( value ) => {
										setAttributes( { maxWidthUnit: value } );
									}}
									units={[ 'px', '%', 'vw' ]}
								/>
								<ResponsiveRangeControls
									label={__( 'Min Width', 'kadence-blocks' )}
									value={( undefined !== minWidth && undefined !== minWidth[ 0 ] ? minWidth[ 0 ] : '' )}
									onChange={value => {
										setAttributes( { minWidth: [ value, ( undefined !== minWidth && undefined !== minWidth[ 1 ] ? minWidth[ 1 ] : '' ), ( undefined !== minWidth && undefined !== minWidth[ 2 ] ? minWidth[ 2 ] : '' ) ] } );
									}}
									tabletValue={( undefined !== minWidth && undefined !== minWidth[ 1 ] ? minWidth[ 1 ] : '' )}
									onChangeTablet={( value ) => {
										setAttributes( { minWidth: [ ( undefined !== minWidth && undefined !== minWidth[ 0 ] ? minWidth[ 0 ] : '' ), value, ( undefined !== minWidth && undefined !== minWidth[ 2 ] ? minWidth[ 2 ] : '' ) ] } );
									}}
									mobileValue={( undefined !== minWidth && undefined !== minWidth[ 2 ] ? minWidth[ 2 ] : '' )}
									onChangeMobile={( value ) => {
										setAttributes( { minWidth: [ ( undefined !== minWidth && undefined !== minWidth[ 0 ] ? minWidth[ 0 ] : '' ), ( undefined !== minWidth && undefined !== minWidth[ 1 ] ? minWidth[ 1 ] : '' ), value ] } );
									}}
									min={0}
									max={( minWidthUnit === 'px' ? 2000 : 100 )}
									step={1}
									unit={minWidthUnit ? minWidthUnit : 'px'}
									onUnit={( value ) => {
										setAttributes( { minWidthUnit: value } );
									}}
									units={[ 'px', '%', 'vw' ]}
								/>
							</KadencePanelBody>
							<KadencePanelBody
								title={__( 'Extra Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={ 'kb-adv-form-radio-extra-settings' }
							>
								<FieldName
									value={inputName}
									uniqueID={uniqueID}
									onChange={( value ) => setAttributes( { inputName: value.replace(/[^a-z0-9-_]/gi, '') } ) }
								/>
								<SelectControl
									label={__( 'Field Auto Fill', 'kadence-blocks' )}
									value={ auto }
									options={[
										{ value: '', label: __( 'Default', 'kadence-blocks' ) },
										{ value: 'name', label: __( 'Name', 'kadence-blocks' ) },
										{ value: 'given-name', label: __( 'First Name', 'kadence-blocks' ) },
										{ value: 'family-name', label: __( 'Last Name', 'kadence-blocks' ) },
										{ value: 'email', label: __( 'Email', 'kadence-blocks' ) },
										{ value: 'organization', label: __( 'Organization', 'kadence-blocks' ) },
										{ value: 'street-address', label: __( 'Street Address', 'kadence-blocks' ) },
										{ value: 'address-line1', label: __( 'Address Line 1', 'kadence-blocks' ) },
										{ value: 'address-line2', label: __( 'Address Line 1', 'kadence-blocks' ) },
										{ value: 'country-name', label: __( 'Country Name', 'kadence-blocks' ) },
										{ value: 'postal-code', label: __( 'Postal Code', 'kadence-blocks' ) },
										{ value: 'tel', label: __( 'Telephone', 'kadence-blocks' ) },
										{ value: 'off', label: __( 'Off', 'kadence-blocks' ) },
									]}
									onChange={( value ) => setAttributes( { auto: value } )}
								/>
								<TextControl
									label={__( 'Input aria description', 'kadence-blocks' )}
									value={ariaDescription}
									onChange={( value ) => setAttributes( { ariaDescription: value } )}
									help={ __( 'This content will be hidden by default and exposed to screen readers as the aria-describedby attribute for this form field. Note that the normal description field will no longer be used for aria-describedby.', 'kadence-blocks' ) }
								/>
								{ required && (
									<TextControl
										label={__( 'Field error message when required', 'kadence-blocks' )}
										value={requiredMessage}
										onChange={( value ) => setAttributes( { requiredMessage: value } )}
										placeholder={( undefined !== label ? label : '' ) + ' ' + __( 'is required', 'kadence-blocks' )}
									/>
								)}
								<TextControl
									label={__( 'Populate with Parameter', 'kadence-blocks' )}
									help={ __( 'Enter a parameter that can be used in the page url to dynamically populate the field.', 'kadence-blocks' ) }
									value={defaultParameter}
									onChange={( value ) => setAttributes( { defaultParameter: value } )}
								/>
							</KadencePanelBody>
						</>
					}

				</InspectorControls>
				<>
					<FormFieldLabel
						required={required}
						label={label}
						showLabel={showLabel}
						setAttributes={setAttributes}
						isSelected={isSelected}
						name={name}
					/>

					{isSelected ?
						<div className={'kb-form-multi'}>
							{times( options.length, n => (
								<div className={'inline-option-add-item'} key={n}>
									<input
										type={'radio'}
										className={'kb-sub-field kb-checkbox-style'}
										onClick={( value ) => { toggleSelected( n, value.target.value ); }}
										checked={options[ n ].selected}
									/>
									<input key={'text' + n} type={'text'} value={options[ n ].label} className={'ignore-field-styles'}
										   onChange={( value ) => updateOption( n, { label: value.target.value } )}/>
									<Button onClick={() => removeOptionItem( n )}>
										<span className="dashicon dashicons dashicons-trash"></span>
									</Button>
								</div>
							) )}

							<Button
								variant="primary"
								icon={ plus }
								className={'kb-form-multi__add-option'}
								onClick={() => {
									let newOptions = options;
									newOptions.push( {
										value: '',
										label: '',
									} );
									setAttributes( { options: newOptions } );
									setRerender( Math.random() );
								}}
							>
								{__( 'Add Option', 'kadence-blocks' )}
							</Button>
						</div>
						:
						<>
							{times( options.length, n => (
								<div key={n} className='kb-radio-check-item'>
									<input
										type={'radio'}
										className={'kb-sub-field kb-checkbox-style'}
										value={options[ n ].value || options[ n ].label}
										onChange={( value ) => false}
									/>
									<label htmlFor={'kb_field'}>{options[ n ].label}</label>
								</div>
							) )}
						</>
					}
					{helpText && <span className="kb-form-field-help">{helpText}</span>}
				</>
				<FieldBlockAppender inline={true} className="kb-custom-inbetween-inserter" getRoot={clientId}/>
			</div>
		</>
	);
}

export default FieldRadio;

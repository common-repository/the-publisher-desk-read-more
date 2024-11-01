import { Fragment } from "react";

const { __ } = wp.i18n
const { Component } = wp.element
const { InspectorControls, PanelColorSettings } = wp.blockEditor
const { PanelBody, RadioControl, SelectControl, ToggleControl,TextControl, RangeControl, FormTokenField } = wp.components
const { apiFetch } = wp;

export default class Inspector extends Component {

  state = {
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }
  
  render() {

		const { attributes, setAttributes } = this.props
		const { showThumbnail } = attributes

    return (
      <InspectorControls>
        <div className="tpd-featured-posts-controls">

          <div style={{padding:'20px'}}>
            <ToggleControl
              label={ __( 'Show Thumbnail' ) }
              checked={ showThumbnail }
              onChange={ () => setAttributes( { showThumbnail: !showThumbnail } ) }
            />
          </div>

        </div>
      </InspectorControls>
    )

  }

}
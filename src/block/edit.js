const { __ } = wp.i18n
const { Component, Fragment } = wp.element
const { Button } = wp.components;
const { RichText } = wp.blockEditor;

import Inspector from './inspector'
import SearchPostModal from './search'

//Import Time Ago component.
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en' // The desired locales.
JavascriptTimeAgo.locale(en) // Initialize the desired locales.

export default class Edit extends Component {

	state = {
		loading: false,
	}

  componentDidMount() {
		if ( !this.props.attributes.id ) {
      this.props.setAttributes({isModalOpen:true})
    }
    // if( !this.props.attributes.titleChanged && this.props.attributes.title !=  ) {

    // }
	}

  render() {

		const { attributes, setAttributes, isSelected } = this.props
		const { id, title, image, link, showThumbnail, readMoreText } = attributes
    const { loading } = this.state

		const setReadMorePost = (new_post) => {

			// just add empty post to main posts arr
			setAttributes({ 
				id: new_post.id, 
				title: new_post.title, 
				image: new_post.image, 
				link: new_post.link,
			});

		}

		return (
			<div className={ this.props.className }>

				<Inspector { ...{ attributes, setAttributes } } />

				<Fragment>
					{ isSelected && !id &&
						<div>
							<SearchPostModal { ...{ attributes, setAttributes } } callbackFromSearch={setReadMorePost} />
							<p className="search-here" onClick={ () => {setAttributes({isModalOpen: true})} }><strong>Read More:</strong> Search for a post here</p>
						</div>
					}
					{ id &&
						<div>
							<SearchPostModal { ...{ attributes, setAttributes } } callbackFromSearch={setReadMorePost} />
							<div className="tpd-read-more-container">
								{ showThumbnail && (
									<img src={image} alt={title} />
								)}
								<div>
									<RichText
										tagName="strong"
										className="tpd_rm_ht"
										value={ readMoreText }
										allowedFormats={ [] }
										onChange={ value => { 
											setAttributes( { readMoreText: value } ) 
										} }
										placeholder={ __( 'Also Read:' ) }
									/><br />
                    <RichText
                      tagName="span"
                      className="tpd_rm_title"
                      value={ title }
                      allowedFormats={ [ 'core/bold', 'core/italic' ] }
                      style={{color:'#006ba1'}}
                      onChange={ value => { 
                        setAttributes( { title: value, titleChanged: true } ) 
                      } }
                      placeholder={ __( 'Post title' ) }
                    />
								</div>
							</div>
							<Button isSecondary onClick={ () => { setAttributes({isModalOpen: true}) } }>EDIT</Button>
						</div>
					}
					{ !isSelected && !id && 
						<p className="search-here"><strong>Read More:</strong> Search for a post here</p>
					}
				</Fragment>
			</div>
		);

  }

}
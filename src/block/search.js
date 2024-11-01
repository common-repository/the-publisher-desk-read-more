const { __ } = wp.i18n
const { Fragment, Component } = wp.element
const { apiFetch } = wp;
const { useSelect } = wp.data;
const { TextControl, Modal } = wp.components;

import { debounce } from 'throttle-debounce'
import ReactTimeAgo from 'react-time-ago'


export default class SearchPostModal extends Component {

	state = {
		s_query: '',
    id: '',
    image: '',
    title: '',
    author_id: '',
    author_name: '',
    excerpt: '',
    isSearching: false,
    results: [],
	}

	componentDidMount() {
    if ( !this.props.attributes.id ) {
      apiFetch( { path: `/wp/v2/posts?per_page=11` } ).then( posts => {
        this.setState( { results: posts } )
      } );
    }
  }

  componentDidUpdate() {

    if ( this.props.attributes.isModalOpen && this.state.s_query == '' ) {
      apiFetch( { path: `/wp/v2/posts?per_page=11` } ).then( posts => {
        this.setState( {  results: posts } )
      } );

      document.getElementById("tpd-featured-search-input").focus();
    }

  }

  componentWillUnmount() {

  }  

  onSearch = debounce( 300, search => {

		if( search.length < 3 ) {
      return
    }

    this.setState( { results: __( 'Loading…' ) } )
    apiFetch( { path: `/wp/v2/posts/?search=${encodeURI( search )}&per_page=20` } ).then( posts => {
      this.setState( { results: posts } )
    } );
    
  } )

  // https://gomakethings.com/decoding-html-entities-with-vanilla-javascript/
  decodeHTML = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  selectThisPost = (post) => {    

    // close modal and set attr
    this.setState( { 
      s_query: '', 
      id: 0, 
      results: [], 
    }, () => {

      this.props.setAttributes({ isModalOpen: false, titleChanged: false })
      let newPost = {
        id: post.id,
        image: post.thumbnail,
        title: this.decodeHTML(post.title.rendered), 
        link: post.link,
      }

      // send back post to main comp
      this.props.callbackFromSearch( newPost )

    } )
  }

	render() {

    const { attributes: { isModalOpen }, setAttributes } = this.props
		const { s_query, isSearching, results } = this.state

		return (

			<Fragment>
        <div>
          { isModalOpen && (
            <Modal
              title="Search"
              className="tpd-featured-modal"
              overlayClassName="tpd-featured-overlay"
              onRequestClose={ () => { 
                this.setState( { s_query: '', id: 0, results: [], } )
                this.props.setAttributes( { isModalOpen: false } )
              } }
            >
              <div className="tpd-featured-header">
                <div className="tpd-featured-container">
                  <TextControl
                    className = "tpd-featured-search"
                    type = "search"
                    id = "tpd-featured-search-input"
                    placeholder = "Search Post"
                    autoComplete = "off"
                    value = { s_query }
                    onChange = { ( value ) => {
                      this.setState( { s_query: value } )
                      this.onSearch( value )
                    } }
                  />
                </div>
              </div>

              <div className={"tpd-posts-search-content"}>

                  { isSearching && (
                    <div className="letter-loadind">
                      <div className="l-1 letter">S</div>
                      <div className="l-2 letter">e</div>
                      <div className="l-3 letter">r</div>
                      <div className="l-4 letter">c</div>
                      <div className="l-5 letter">h</div>
                      <div className="l-6 letter">i</div>
                      <div className="l-7 letter">n</div>
                      <div className="l-8 letter">g</div>
                      <div className="l-9 letter">.</div>
                      <div className="l-10 letter">.</div>
                      <div className="l-11 letter">.</div>
                    </div>
                  ) }

                  { results.length > 0 && Array.isArray(results) ?
                    (
                      <ul>
                        { results.map( post => {
                          return (
                            <li
                              key = { post.id }
                              onClick = { () => { this.selectThisPost(post) }
                              }
                            >
                              { post.thumbnail && ( <img src={post.thumbnail} /> ) }
                              <div className="tpd-post-info">
                                  <span>{ this.decodeHTML(post.title.rendered) }</span>
                                  <div>
                                    <div>
                                      { post.author_avatar && ( <img src={post.author_avatar}/> )} {post.author_name}
                                    </div>
                                    <div>
                                      <ReactTimeAgo date={ new Date(post.date) }/>
                                    </div>
                                  </div>
                              </div>
                            </li>
                          )
                        } ) }
                      </ul>
                    ) : (
                      <p>{results}</p>
                    )
                  }

              </div>

            </Modal>
          ) }
        </div>
			</Fragment>
		)
	}
}
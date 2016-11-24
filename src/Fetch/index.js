/**
 * Copyright 2016-present, Baifendian, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import xhr from '../xhr'
import Spinner from '../Spinner'
import './index.less'

class Fetch extends Component {

  constructor() {
    super()
    this.state = {
      xhr: 'init',
      msg: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.url !== (this.props.url || this.url)) {
      this.fetch(nextProps.url)
    }
  }

  componentWillMount() {
    this.props.url && this.fetch(this.props.url)
  }

  fetch(url) {
    this.url = url
    this.timer = this.lazyShowLoading()
    setTimeout(() => {
      xhr({
        url,
        complete: () => {
          clearTimeout(this.timer)
        },
        success: ::this.handleSuccess,
        error: ::this.handleError
      })
    }, this.props.delay || 0)
  }

  lazyShowLoading() {
    return setTimeout(() => {
      this.setState({xhr: 'loading'})
    }, 150)
  }

  handleSuccess(data) {
    this.setState({xhr: 'success'})
    this.props.onSuccess(data)
  }

  handleError(msg) {
    this.setState({xhr: 'error', msg})
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    this.handleSuccess = this.handleError = () => {}
  }

  stateMap = {
    init() {
      return this.props.url ? null : this.props.children
    },
    success() {
      return this.props.children
    },
    loading() {
      return (
        <div className="bfd-fetch__mask">
          <Spinner height={this.props.spinnerHeight} className="bfd-fetch__state" />
        </div>
      )
    },
    error() {
      return (
        <div className="bfd-fetch__mask">
          <div className="bfd-fetch__state bfd-fetch__state-error">{this.state.msg}</div>
        </div>
      )
    }
  }

  render() {
    const { className, url, onSuccess, defaultHeight, delay, ...other } = this.props
    if (defaultHeight) {
      other.style = Object.assign(other.style || {}, {
        minHeight: defaultHeight + 'px'
      })
    }
    return (
      <div className={classnames('bfd-fetch', className)} {...other}>
        {this.stateMap[this.state.xhr].call(this)}
      </div>
    )
  }
}

Fetch.propTypes = {
  url: PropTypes.string,
  onSuccess: PropTypes.func,
  defaultHeight: PropTypes.number,
  spinnerHeight: PropTypes.number,
  delay: PropTypes.number
}

export default Fetch

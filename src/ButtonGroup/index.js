/**
 * Created by tenglong.jiang on 2016-08-08.
 */
 
import React, { Component, PropTypes } from 'react'
import findAllByType from '../findAllByType'
import classnames from 'classnames'
import Button from '../Button'
import './index.less'

class ButtonGroup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    'value' in nextProps && this.setState({
      value: nextProps.value
    })
  }

  render() {
    const { className, children, ...other } = this.props
    const items = findAllByType(children, Button)
    const buttons = items.map((item, index) => {
      if (!item) return
      return React.cloneElement(item, {
        key: index,
        type: (item.props.value == this.state.value) ? '' : 'minor',
        onClick: e => {
          e.stopPropagation()
          this.handleClick(item.props.value)
        }
      })
    })
    return (
      <div className={classnames('bfd-button-group', className)} {...other}>
        {buttons}
      </div>
    )
  }

  handleClick(value) {
    this.setState({
      value
    })
    this.props.onChange && this.props.onChange(value)
  }
}

ButtonGroup.propTypes = {

  // 默认值
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // 选中事件，参数返回被选中的值
  onChange: PropTypes.func,
  
  customProp(props) {
    if ('value' in props && !props.onChange) {
      return new Error('You provided a `value` prop without an `onClick` handler')
    }
  }
}

export default ButtonGroup
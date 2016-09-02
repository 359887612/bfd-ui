import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import Icon from '../Icon'

class NavItem extends Component {

  constructor(props) {
    super()
    this.state = {
      open: props.defaultOpen || false,
    }
  }

  componentWillMount() {
    const href = this.getHref(this.props)
    const active = this.isActive(this.props, href)
    const state = { href, active }
    if (this.props.children && active) {
      state.open = true
    }
    this.setState(state)
  }

  componentWillReceiveProps(nextProps) {
    const href = this.getHref(nextProps)
    const active = this.isActive(nextProps, href)
    this.setState({ href, active })
  }

  getHref(props) {
    let href = props.href
    if (!props.index && !href) return ''
    const baseURL = this.context.nav.props.href || ''
    href = baseURL + '/' + (href || '')
    return href.replace(/\/+/g, '/').replace(/(.+)\/$/, '$1')
  }

  isActive(props, href) {
    if (props.index) {
      return href === (location.pathname || '/')
    } else {
      return href && location.href.indexOf(href) !== -1
    }
  }

  toggle(e) {
    e.preventDefault()
    this.setState({open: !this.state.open})
  }

  handleClick(e) {
    this.props.onClick && this.props.onClick(e)
    !this.props.children && this.context.nav.handleItemClick(this.props, e)
  }
  
  render() {
    const { open, href, active } = this.state
    const { children, className, icon, title, ...other } = this.props

    delete other.href
    delete other.defaultOpen

    const NavIcon = icon && <Icon type={icon} className="bfd-nav__item-icon" />
    const Toggle = children && <Icon type="caret-right" className="bfd-nav__item-toggle" />

    const Item = children
      ? <a href={href} onClick={::this.toggle}>{NavIcon}{title}{Toggle}</a>
      : <Link to={href} query={this.props.query}>{NavIcon}{title}{Toggle}</Link>

    const classNames = classnames(
      'bfd-nav__item', 
      {
        'bfd-nav__item--open': open,
        'bfd-nav__item--active': active
      },
      className
    )

    // 收起状态时不再渲染子节点
    return (
      <li 
        onClick={::this.handleClick} 
        className={classNames}
        {...other}
      >
        {Item}
        {open && children && <ul>{children}</ul>}
      </li>
    )
  }
}

NavItem.contextTypes = {
  history: PropTypes.object,
  nav: PropTypes.object
}

NavItem.propTypes = {

  index: PropTypes.bool,

  // 当前菜单 href，非叶子节点也需要指定，与路由对应
  href: PropTypes.string,

  // 菜单图标，参考 Icon 组件 type 属性
  icon: PropTypes.string,

  // 菜单标题
  title: PropTypes.string,

  // 初始化是否展开（不可控），用于非叶子节点
  defaultOpen: PropTypes.bool
}

export default NavItem
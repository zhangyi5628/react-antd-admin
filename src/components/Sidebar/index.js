import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd'
import { Link } from 'react-router'
import { getAllMenu, updateNavPath } from '../../actions/menu'

const SubMenu = Menu.SubMenu

import './index.less'

const defaultProps = {
  items: []
}

const propTypes = {
  items: PropTypes.array
}

const { Sider } = Layout;

class Sidebar extends React.Component {

  state = {
    activeKey: "",
    collapsed: false,
    mode: 'inline',
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: !this.state.collapsed ? 'vertical' : 'inline',
    });
  }

  componentDidMount () {
    this.props.getAllMenu()
  }

  menuClickHandle = (item) => {
    this.setState({
      activeKey: 'menu'+item.key
    })
    this.props.updateNavPath(item.keyPath, item.key)
  }

  render () {
    const { items } = this.props
    const { router } = this.context
    let openKey = []
    let activeKey = this.state.activeKey
    const menu = items.map((item) => {
      openKey.push('sub'+item.key)
      return (
        <SubMenu
          key={'sub'+item.key}
          title={<span><Icon type={item.icon} /><span className="nav-text">{item.name}</span></span>}
        >
          {item.child.map((node) => {
            if(node.url && router.isActive(node.url, true)){
              activeKey = 'menu'+node.key
            }
            let url = node.url
            return (
              <Menu.Item key={'menu'+node.key}>
                <Link to={url}>{node.name}</Link>
              </Menu.Item>
            )
          })}
        </SubMenu>
      )
    });
    return (
      <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
        <div className="ant-layout-logo"></div>
        <Menu
          mode={this.state.mode} theme="dark"
          selectedKeys={[activeKey]}
          onClick={this.menuClickHandle}
        >
          {menu}
        </Menu>
        <div className="sider-trigger">
          <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
        </div>
      </Sider>
    )
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;
Sidebar.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {

  return {
    items: state.menu.items
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllMenu: bindActionCreators(getAllMenu, dispatch),
    updateNavPath: bindActionCreators(updateNavPath, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)

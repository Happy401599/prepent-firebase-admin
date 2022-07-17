import React from "react";
import { 
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";

import {
  DeliveredProcedureOutlined,
  UserOutlined,
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { 
  Layout, 
  Menu,
  Dropdown,
  Button,
  message
} from 'antd';
import {
  getAuth, signOut
} from 'firebase/auth';

import DashboardPage from "./DashboardPage";
import UsersPage from "./UsersPage";
import CharityPage from "./CharityPage";
import BlogPage from "./BlogPage";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '0', <HomeOutlined />),
  getItem('Users', '1', <UserOutlined />),
  getItem('Charities', '2', <AppstoreOutlined />),
  getItem('Blogs', '3', <DeliveredProcedureOutlined />),
];

export default function MasterLayout(props) {
  const history = useHistory();
  const location = useLocation();
  const auth = getAuth();

  const [collapsed, setCollapsed] = React.useState(false);

  const onNavigation = (ev) => {
    if (ev.key != navigationKey) {
      switch(ev.key) {
        case '0':
          history.push('/');
          break;

        case '1':
          history.push('/user');
          break;

        case '2':
          history.push('/charity')
          break;

        case '3':
          history.push('/blog');
          break;
      }
    }
  };

  let navigationKey = '0';
  if (location.pathname == '/') {
    navigationKey = '0';
  }
  else if (location.pathname.includes('/user')) {
    navigationKey = '1';
  }
  else if (location.pathname.includes('/charity')) {
    navigationKey = '2';
  }
  else if (location.pathname.includes('/blog')) {
    navigationKey = '3';
  }

  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        message.success("You have successfully signed out.")
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
          <h2
            style={{
              color: 'white',
              textAlign: 'center',
              marginTop: 16
            }}
          >
            <b>Prepent Admin</b>
          </h2>
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['1']} 
          selectedKeys={[navigationKey]}
          mode="inline" 
          items={items} 
          onSelect={onNavigation}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 20
          }}
        >
          <Dropdown
            overlay={(
              <Menu
                items={[
                  {
                    key: '1',
                    label: 'Sign Out',
                    icon: <LogoutOutlined/>,
                    onClick: onSignOut
                  }
                ]}
              />
            )}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button>
              {auth.currentUser && auth.currentUser.email}
            </Button>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Switch>
            <Route path='/user' component={UsersPage} />
            <Route path='/charity' component={CharityPage} />
            <Route path='/blog' component={BlogPage} />
            <Route index path='/' component={DashboardPage} />
          </Switch>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Prepent Admin ©2022 Created by BlueDev
        </Footer>
      </Layout>
    </Layout>
  );
}
import React from "react";
import {
  Card,
  Button,
  Form,
  Input,
  message
} from "antd";
import {
  LoginOutlined
} from "@ant-design/icons";
import {
  NavLink, useHistory, useParams, useLocation
} from "react-router-dom";
import {
  getAuth, signInWithEmailAndPassword, AuthErrorCodes, onAuthStateChanged
} from "firebase/auth";
import { useAuth } from "../../components/AuthProvider";

export default function SignInPage(props) {
  const auth = getAuth();
  const history = useHistory();
  const location = useLocation();
  const user = useAuth();

  const [loading, setLoading] = React.useState(false);

  const onFinish = (values) => {
    signIn(values.email, values.password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const signIn = async (email, password) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        message.success('You have logged into Prepent admin app successfully.');
      })
      .catch((error) => {
        console.log(error.code);
        switch(error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
          case AuthErrorCodes.USER_DELETED: {
            message.error('Your email address is not signed up yet.');
            break;
          }
          
          default: {
            message.error('Something went wrong. Please try again later.');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    return onAuthStateChanged(auth, (userCredential) => {
      if (userCredential) {
        if (location.state.from) {
          history.replace(location.state.from);
        }
        else {
          history.replace('/');
        }
      }
    });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh',
      backgroundColor: '#eaeaea',
    }}>
      <Card
        title={(<h2><strong>PrePent Sign In</strong></h2>)}
        style={{ width: 350 }}
      >
        <Form
          name="signinForm"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{required: true, message: 'Please input your email address.'}]}
          >
            <Input
              placeholder="Your Email Address"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: "Please input your password."}]}
          >
            <Input.Password
              placeholder="Your Password"
            />
          </Form.Item>

          <p>
            Don't you have an account? Please sign up <NavLink to='/auth/signup'>here</NavLink>.
          </p>
          <p>
            <NavLink to='/auth/reset_password'>
              Forgot your password?
            </NavLink>
          </p>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                float: 'right'
              }}
              icon={<LoginOutlined/>}
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
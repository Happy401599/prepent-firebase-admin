import React from "react";
import {
  Card,
  Button,
  Form,
  Input
} from "antd";
import {
  useHistory
} from "react-router-dom";

export default function ForgotPasswordPage(props) {

  const history = useHistory();

  const onBack = () => {
    history.goBack();
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

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
        title={(<h2><strong>Forgot your password?</strong></h2>)}
        style={{ width: 350 }}
      >
        <Form
          name="signinForm"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p>
            We'll send you link for reset password. Please let us know your email address.
          </p>

          <Form.Item
            label="Email"
            name="email"
            rules={[{required: true, message: 'Please input your email address.'}]}
          >
            <Input
              placeholder="Your Email Address"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                float: 'right'
              }}
            >
              Send Link
            </Button>
            <Button
              onClick={onBack}
            >
              Back
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
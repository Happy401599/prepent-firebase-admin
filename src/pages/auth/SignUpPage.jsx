import React from "react";
import {
  Card,
  Button,
} from "antd";
import {
  useHistory
} from "react-router-dom";

export default function SignUpPage(props) {
  const history = useHistory();

  const onBack = () => {
    history.goBack();
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
        title={(<h2><strong>PrePent Sign Up</strong></h2>)}
        style={{ width: 350 }}
      >
        <p>
          Need an new account? Please try to insert new account on Firebase console.
        </p>

        <div>
          <Button
            style={{
              float: 'right'
            }}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
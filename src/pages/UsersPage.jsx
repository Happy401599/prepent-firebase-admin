import React from "react";
import {
  Breadcrumb,
  Button,
  Input,
  Modal,
  Table
} from "antd";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import moment from "moment";
import { DeleteFilled, EditFilled, PlusCircleFilled } from "@ant-design/icons";
import md5 from "md5";
import { v4 as uuidv4 } from 'uuid';

export default function UsersPage(props) {
  const [data, setData] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10
  });

  const [user, setUser] = React.useState({
    id: "new",
    name: "",
    email: "",
    password: "",
    created_date: null,
  });
  const [modalTitle, setModalTitle] = React.useState("Create User");
  const [isModalOpened, setIsModalOpened] = React.useState(false);

  const db = getFirestore(getApp());

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
  };

  const fetchData = () => {
    setLoading(true);

    const ref = collection(db, 'user');

    getDocs(ref)
      .then((snapshot) => {
        let newData = [];
        snapshot.forEach((doc) => {
          newData.push(doc.data());
        });

        setData(newData);
        setLoading(false);
      });
  };

  const paginate = () => {
    let newList = data.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize);
    setList(newList);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    paginate();
  }, [pagination, data]);

  const handleCreateUser = () => {
    setModalTitle("Create User");
    setUser({
      id: "new",
      name: "",
      email: "",
      password: "",
      created_date: null,
    });
    setIsModalOpened(true);
  };

  const handleEditUser = (item) => {
    setModalTitle("Edit User");
    setUser({
      id: item.id,
      name: item.name,
      email: item.email,
      password: item.password,
      created_date: item.created_date
    });
    setIsModalOpened(true);
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    await deleteDoc(doc(db, 'user', id));
    fetchData();
  };

  const handleOnSave = async () => {
    setIsModalOpened(false);
    setLoading(true);
    if (user.id == "new") {
      let uuid = uuidv4();
      await setDoc(doc(db, 'user', uuid), {
        id: uuid,
        name: user.name,
        email: user.email,
        password: md5(user.password),
        created_date: Timestamp.fromDate(new Date())
      });
      fetchData();
    }
    else {
      await updateDoc(doc(db, 'user', user.id), {
        name: user.name,
        email: user.email,
      });
      fetchData();
    }
  };

  const handleOnCancel = () => {
    setIsModalOpened(false);
  };

  const handleOnUserInfoChange = (key, value) => {
    let newUser = {...user};
    newUser[key] = value;
    setUser(newUser);
  };

  return (
    <React.Fragment>
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <h2><b>Users</b></h2>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={handleCreateUser}
          style={{marginBottom: '0.5em'}}
        >
          Create New User
        </Button>
      </div>
      <div
        className="site-layout-background"
        style={{
          padding: 18,
          backgroundColor: 'white'
        }}
      >
        <Table
          dataSource={list}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              sorter: false,
            },
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Email',
              dataIndex: 'email'
            },
            {
              title: 'Created At',
              dataIndex: 'created_date',
              render: (v) => {
                return moment(v.seconds * 1000).format('YYYY/MM/DD HH:mm:ss');
              }
            },
            {
              title: 'Actions',
              dataIndex: 'id',
              render: (value, item) => {
                return (
                  <div>
                    <Button
                      type="primary"
                      icon={<EditFilled />}
                      onClick={() => handleEditUser(item)}
                      shape="circle"
                      size="small"
                      style={{marginRight: 4}}
                    />
                    <Button
                      type="primary"
                      icon={<DeleteFilled />}
                      onClick={() => handleDeleteUser(value)}
                      danger={true}
                      shape="circle"
                      size="small"
                    />
                  </div>
                );
              }
            }
          ]}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowKey={record => record.id}
        />
      </div>
      <Modal
        visible={isModalOpened}
        title={modalTitle}
        okText={"Save"}
        onOk={handleOnSave}
        cancelText={"Cancel"}
        onCancel={handleOnCancel}
      >
        <div>
          <label>User Name</label>
          <Input
            placeholder="User Name"
            value={user.name}
            onChange={(ev) => handleOnUserInfoChange('name', ev.currentTarget.value)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Email</label>
          <Input
            placeholder="Email Address"
            value={user.email}
            onChange={(ev) => handleOnUserInfoChange('email', ev.currentTarget.value)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Password</label>
          <Input.Password
            placeholder="Password"
            value={user.password}
            onChange={(ev) => handleOnUserInfoChange('password', ev.currentTarget.value)}
            disabled={user.id != "new"}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Created At</label>
          <Input
            placeholder="Created At"
            value={user.created_date && moment(user.created_date.seconds * 1000).format("YYYY-MM-DD HH:mm:ss")}
            disabled={true}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
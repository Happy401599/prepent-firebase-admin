import React from "react";
import {
  Breadcrumb,
  Button,
  Input,
  Modal,
  Select,
  Table
} from "antd";
import { collection, doc, getDocs, getFirestore, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import moment from "moment";
import { EditFilled, PlusCircleFilled } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';

export default function BlogPage(props) {
  const [data, setData] = React.useState([]);
  const [users, setUsers] = React.useState({});
  const [charities, setCharities] = React.useState({});
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10
  });

  const [blog, setBlog] = React.useState({
    id: "new",
    user_id: null,
    charity_id: null,
    description: "",
    amount: 0,
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

    const ref = collection(db, 'blog');

    getDocs(ref)
      .then((snapshot) => {
        let newData = [];
        snapshot.forEach((doc) => {
          newData.push(doc.data());
        });
        setData(newData);

        getDocs(collection(db, 'user'))
          .then((snapshot) => {
            let newUsers = {};
            snapshot.forEach((doc) => {
              let v = doc.data();
              newUsers[v.id] = v;
            });
            setUsers(newUsers);

            getDocs(collection(db, 'charity'))
              .then((snapshot) => {
                let newCharities = {};
                snapshot.forEach((doc) => {
                  let v = doc.data();
                  newCharities[v.id] = v;
                }); 
                setCharities(newCharities);

                setLoading(false);
              });
          });
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

  const handleCreateBlog = () => {
    setModalTitle("Create Blog");
    setBlog({
      id: "new",
      user_id: null,
      charity_id: null,
      description: "",
      amount: 0,
      created_date: null,
    });
    setIsModalOpened(true);
  };

  const handleEditBlog = (item) => {
    setModalTitle("Edit Blog");
    setBlog({
      id: item.id,
      user_id: item.user_id,
      charity_id: item.charity_id,
      description: item.description,
      amount: item.amount,
      created_date: item.created_date,
    });
    setIsModalOpened(true);
  };

  const handleOnSave = async () => {
    setIsModalOpened(false);
    setLoading(true);
    if (blog.id == "new") {
      let uuid = uuidv4();
      await setDoc(doc(db, 'blog', uuid), {
        id: uuid,
        description: blog.description,
        amount: blog.amount,
        user_id: blog.user_id,
        charity_id: blog.charity_id,
        created_date: Timestamp.fromDate(new Date())
      });
      fetchData();
    }
    else {
      await updateDoc(doc(db, 'blog', blog.id), {
        user_id: blog.user_id,
        charity_id: blog.charity_id,
        description: blog.description,
        amount: blog.amount,
      });
      fetchData();
    }
  };

  const handleOnCancel = () => {
    setIsModalOpened(false);
  };

  const handleOnBlogInfoChange = (key, value) => {
    let newBlog = {...blog};
    newBlog[key] = value;
    setBlog(newBlog);
  };

  return (
    <React.Fragment>
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Blogs</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <h2><b>Blogs</b></h2>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={handleCreateBlog}
          style={{marginBottom: '0.5em'}}
        >
          Create New Blog
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
              title: 'User',
              dataIndex: 'user',
              render: (v, item) => {
                if (users[item.user_id]) {
                  return users[item.user_id].name;
                }
              }
            },
            {
              title: 'Charity',
              dataIndex: 'charity',
              render: (v, item) => {
                if (charities[item.charity_id]) {
                  return charities[item.charity_id].name;
                }
              }
            },
            {
              title: 'Description',
              dataIndex: 'description'
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              render: (v, item) => {
                return "$ " + Number(v).toFixed(2);
              }
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
                      onClick={() => handleEditBlog(item)}
                      shape="circle"
                      size="small"
                      style={{marginRight: 4}}
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
          <label>User</label><br/>
          <Select
            placeholder="Select User"
            value={blog.user_id}
            onChange={(value) => handleOnBlogInfoChange('user_id', value)}
            style={{width: '100%'}}
          >
            {Object.entries(users).map((item) => (
              <Select.Option value={item[1].id}>{item[1].name}</Select.Option>
            ))}
          </Select>
        </div>
        <div style={{marginTop: 12}}>
          <label>Charity</label><br/>
          <Select
            placeholder="Select Charity"
            value={blog.charity_id}
            onChange={(value) => handleOnBlogInfoChange('charity_id', value)}
            style={{width: '100%'}}
          >
            {Object.entries(charities).map((item) => (
              <Select.Option value={item[1].id}>{item[1].name}</Select.Option>
            ))}
          </Select>
        </div>
        <div style={{marginTop: 12}}>
          <label>Descrition</label>
          <Input.TextArea
            placeholder="Descrition"
            value={blog.description}
            onChange={(ev) => handleOnBlogInfoChange('description', ev.currentTarget.value)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Amount</label>
          <Input
            type="number"
            placeholder="Amount"
            value={blog.amount}
            onChange={(ev) => handleOnBlogInfoChange('amount', ev.currentTarget.value)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Created At</label>
          <Input
            placeholder="Created At"
            value={blog.created_date && moment(blog.created_date.seconds * 1000).format("YYYY-MM-DD HH:mm:ss")}
            disabled={true}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
import React from "react";
import {
  Breadcrumb,
  Button,
  Input,
  Modal,
  Switch,
  Table
} from "antd";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import moment from "moment";
import { DeleteFilled, EditFilled, PlusCircleFilled } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';

export default function CharityPage(props) {
  const [data, setData] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10
  });

  const [charity, setCharity] = React.useState({
    id: "new",
    name: "",
    description: "",
    enable: true,
    created_date: null,
  });
  const [modalTitle, setModalTitle] = React.useState("Create Charity");
  const [isModalOpened, setIsModalOpened] = React.useState(false);

  const db = getFirestore(getApp());

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
  };

  const fetchData = () => {
    setLoading(true);

    const ref = collection(db, 'charity');

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
    setModalTitle("Create Charity");
    setCharity({
      id: "new",
      name: "",
      description: "",
      enable: true,
      created_date: null,
    });
    setIsModalOpened(true);
  };

  const handleEditCharity = (item) => {
    setModalTitle("Edit Charity");
    setCharity({
      id: item.id,
      name: item.name,
      description: item.description,
      enable: item.enable,
      created_date: item.created_date
    });
    setIsModalOpened(true);
  };

  const handleDeleteCharity = async (id) => {
    setLoading(true);
    await deleteDoc(doc(db, 'charity', id));
    fetchData();
  };

  const handleOnSave = async () => {
    setIsModalOpened(false);
    setLoading(true);
    if (charity.id == "new") {
      let uuid = uuidv4();
      await setDoc(doc(db, 'charity', uuid), {
        id: uuid,
        name: charity.name,
        description: charity.description,
        enable: charity.enable,
        created_date: Timestamp.fromDate(new Date())
      });
      fetchData();
    }
    else {
      await updateDoc(doc(db, 'charity', charity.id), {
        name: charity.name,
        description: charity.description,
        enable: charity.enable,
      });
      fetchData();
    }
  };

  const handleOnCancel = () => {
    setIsModalOpened(false);
  };

  const handleOnCharityInfoChange = (key, value) => {
    let v = {...charity};
    v[key] = value;
    setCharity(v);
  };

  return (
    <React.Fragment>
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Charity</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <h2><b>Charities</b></h2>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={handleCreateUser}
          style={{marginBottom: '0.5em'}}
        >
          Create New Charity
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
              title: 'Description',
              dataIndex: 'description'
            },
            {
              title: 'Enabled',
              dataIndex: 'enable',
              render: (v) => {
                return (
                  <Switch disabled checked={v} />
                );
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
                      onClick={() => handleEditCharity(item)}
                      shape="circle"
                      size="small"
                      style={{marginRight: 4}}
                    />
                    <Button
                      type="primary"
                      icon={<DeleteFilled />}
                      onClick={() => handleDeleteCharity(value)}
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
          <label>Charity Name</label>
          <Input
            placeholder="Charity Name"
            value={charity.name}
            onChange={(ev) => handleOnCharityInfoChange('name', ev.currentTarget.value)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Description</label>
          <Input.TextArea
            placeholder="Email Address"
            value={charity.description}
            onChange={(ev) => handleOnCharityInfoChange('description', ev.currentTarget.value)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Enable</label><br/>
          <Switch
            value={charity.enable}
            onChange={(checked) => handleOnCharityInfoChange('enable', checked)}
          />
        </div>
        <div style={{marginTop: 12}}>
          <label>Created At</label>
          <Input
            placeholder="Created At"
            value={charity.created_date && moment(charity.created_date.seconds * 1000).format("YYYY-MM-DD HH:mm:ss")}
            disabled={true}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
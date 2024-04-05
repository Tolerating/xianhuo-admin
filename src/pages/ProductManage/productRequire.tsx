import React, { useRef, useState } from 'react';
import TableRender, { ProColumnsType } from 'table-render';
import { Button, Form, Input, Modal, Popconfirm, Tag, message } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import { updateRequireStatus, addRequireStatus, pageProductRequire } from '@/api/product';
import { PageContainer } from '@ant-design/pro-components';

const initTable = async (params: any) => {
  console.log(params);
  const { current, pageSize} = params;
  let result = await pageProductRequire(current, pageSize);
  return {
    data: result.data.records,
    total: result.data.total,
  };
};

const Post: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef(null);

  type FieldType = {
    name?: string;
  };
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      const result = await addRequireStatus(values.name)

      if(String(result.data)!=="101"){
         //@ts-ignore
         tableRef.current?.refresh({ stay: true });
        setOpenDialog(false)
        messageApi.open({
          type: 'success',
          content: result.message,
        });
      }else{
        messageApi.open({
          type: 'error',
          content: result.message,
        });
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const columns: ProColumnsType = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '商品要求名',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag style={{ fontSize: 18 }} color="#55acee">
          {Number(status) === 0 ? '不生效' : '生效'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },

    {
      title: '操作',
      render: (row, record) => (
        <>
          {Number(row.status) === 1 && (
            <Popconfirm
              title="提示"
              description="确定将该条商品要求置为无效？"
              onConfirm={() => {
                updateRequireStatus(row.id, 0).then((res) => {
                  console.log(res);
                  messageApi.open({
                    type: 'success',
                    content: res.message,
                  });
                  //@ts-ignore
                  tableRef.current?.refresh({ stay: true });
                });
              }}
              okText="确定"
              cancelText="取消"
            >
              <a style={{ marginRight: 10 }} onClick={() => console.log(row.title, record)}>
                不生效
              </a>
            </Popconfirm>
          )}
          {Number(row.status)  === 0 && (
            <Popconfirm
              title="提示"
              description="确定将该条商品要求生效？"
              onConfirm={() => {
                updateRequireStatus(
                  row.id,
                  1,
                ).then((res) => {
                  messageApi.open({
                    type: 'success',
                    content: res.message,
                  });
                  //@ts-ignore
                  tableRef.current?.refresh({ stay: true });
                });
              }}
              okText="确定"
              cancelText="取消"
            >
              <a onClick={() => console.log(row.title, record)}>生效</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];
  return (
    <PageContainer breadcrumbRender={false}>
      <TableRender
        request={initTable}
        columns={columns}
        ref={tableRef}
        toolbarRender={
          <>
            <Button onClick={()=>setOpenDialog(true)} type="primary">
              <PlusOutlined />
              新增
            </Button>
          </>
        }
      />
      <Modal
        title="新增"
        centered
        open={openDialog}
        onOk={onCheck}
        onCancel={() => setOpenDialog(false)}
      >
         <Form
    name="basic"
    form={form}
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: false }}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="要求名称"
      name="name"
      rules={[{ required: true, message: '请输入要求名!' }]}
    >
      <Input />
    </Form.Item>
  </Form>

      </Modal>
      {contextHolder}
    </PageContainer>
  );
};

export default Post;

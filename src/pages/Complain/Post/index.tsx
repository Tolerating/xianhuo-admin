
import React, { useRef, useState } from 'react';
import TableRender, { ProColumnsType } from 'table-render';
import { Drawer, List, Modal, Popconfirm, Tag, message } from 'antd';
import { CreditCardOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {pagePostComplain,complainById,dealComplain} from '@/api/complain'
import { PageContainer } from '@ant-design/pro-components';
import { Complain } from '@/types/Complain';
import { RequireInfo } from '@/types/RequireInfo';

const initTable = async (params:any)=>{
  console.log(params);
  const {current,pageSize,startTime,endTime} = params
  let result = await pagePostComplain(current,pageSize,startTime,endTime);
  return {
    data:result.data.records,
    total:result.data.total
  }
}

const schema = {
  type: 'object',
  labelWidth: 70,
  properties: {
    created_at: {
      bind:["startTime","endTime"],
      title: '投诉时间',
      type: 'range',
      format: 'date'
    }
  }
};






const Post: React.FC = () => {
  // 右侧抽屉
  const [openRight, setOpenRight] = useState(false);
  const [openDialog,setOpenDialog] = useState(false)
  const [complainInfo,setComplainInfo] = useState<RequireInfo>({} as RequireInfo)
  const [currentRow,setCurrentRow] =useState<Complain>({} as Complain)
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef(null)
  /**
 * 打开投诉帖子抽屉
 *
 */
  const openDrawer = (id:number,row:any)=>{
    setOpenRight(true)
    console.log(row);
    setCurrentRow(row)
    complainById(id).then(res=>{
      setComplainInfo(res.data)
    })
  }

const columns:ProColumnsType = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '投诉人',
    dataIndex: 'complaintName'
  },
  {
    title:"投诉原因",
    dataIndex: 'complainantCause',
  },
  {
    title:"被投诉的帖子",
    dataIndex: 'complainantSubject',
    render:(complainantSubject,row)=>(<Tag onClick={()=>{openDrawer(complainantSubject,row)}} style={{fontSize:18}} icon={<CreditCardOutlined />} color="#55acee">{complainantSubject}</Tag>)
  },
  {
    title:"发帖人",
    dataIndex: 'sellerName',
  },
  {
    title:"投诉时间",
    dataIndex: 'createTime',
  },

  {
    title: '操作',
    render: (row, record) => (
     <>
       <Popconfirm
      title="提示"
      description="确定处理该条投诉无效？"
      onConfirm={()=>{
        dealComplain(row.id,row.complainantSubject,row.complainantId,row.sellerId,0).then(res=>{
          console.log(res);
          messageApi.open({
            type: 'success',
            content: res.message,
          });
          //@ts-ignore
          tableRef.current?.refresh({ stay: true });

        })
      }}
      // onCancel={cancel}
      okText="确定"
      cancelText="取消"
    >
     <a style={{marginRight:10}} onClick={() => console.log(row.title,record)}>无效</a>
  </Popconfirm>
  <Popconfirm
      title="提示"
      description="确定该条投诉属实，进行下架操作？"
      onConfirm={()=>{
        dealComplain(row.id,row.complainantSubject,row.complainantId,row.sellerId,1).then(res=>{
          messageApi.open({
            type: 'success',
            content: res.message,
          });
          //@ts-ignore
          tableRef.current?.refresh({ stay: true });

        })
      }}
      // onCancel={cancel}
      okText="确定"
      cancelText="取消"
    >
      <a onClick={() => console.log(row.title,record)}>下架</a>
  </Popconfirm>


     </>
    ),
  }
];


  const closeDrawer = ()=>{
    setOpenRight(false)
  }
  return (
    <PageContainer breadcrumbRender={false}>
       <TableRender
      search={{ schema }}
      request={initTable}
      columns={columns}
      ref={tableRef}
      // title='最简表格'
      // toolbarRender={
      //   <>
      //     <Button>查看日志</Button>
      //     <Button>导出数据</Button>
      //     <Button type='primary'>
      //       <PlusOutlined />
      //       新增
      //     </Button>
      //   </>
      // }
    />
    <Drawer title="帖子详细内容" onClose={closeDrawer} open={openRight}>
    <List
    itemLayout="horizontal">
      <List.Item>
      <List.Item.Meta
          avatar={<UserOutlined />}
          title="发帖人"
          description={currentRow.sellerName}
        />
      </List.Item>
      <List.Item>
        <List.Item.Meta
          avatar={<UserOutlined />}
          title="帖子详情"
          description={complainInfo.detail}
        />
      </List.Item>
      <List.Item>
        <List.Item.Meta
          avatar={<EnvironmentOutlined />}
          title="类别"
          description={<Tag>{complainInfo.categoryName}</Tag>}
        />
      </List.Item>
      <List.Item>
        <List.Item.Meta
          avatar={<EnvironmentOutlined />}
          title="帖子状态"
          description={<Tag>{String(complainInfo.status)==="1"?"未解决":"已解决"}</Tag>}
        />
      </List.Item>
      <List.Item>
        <List.Item.Meta
          avatar={<EnvironmentOutlined />}
          title="学校名称"
          description={complainInfo.school}
        />
      </List.Item>
    </List>
      </Drawer>
      <Modal
        title="Modal 1000px width"
        centered
        open={openDialog}
        onOk={() => setOpenDialog(false)}
        onCancel={() => setOpenDialog(false)}
        width={1000}
      >

      </Modal>
      {contextHolder}
    </PageContainer>
  );
};

export default Post;

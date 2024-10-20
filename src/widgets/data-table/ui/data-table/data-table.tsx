import {Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Alert, Button, Form, FormInstance, Modal, notification, Popconfirm, Space, Table} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {IError} from "@/entities/error";

interface IProps<T> {
  columns: ColumnsType<T>;
  data: T[] | undefined;
  isLoading: boolean;
  onUpdate: () => void;
  bordered?: boolean;
  pagination?: boolean;
  isEditable: boolean;
  isSelectable?: boolean;
  selectedRow?: T | undefined;
  setSelectedRow?: Dispatch<SetStateAction<T | undefined>>;
  form?: FormInstance;
  children?: ReactNode;
  create?: (data: T) => Promise<{data?: T, error?: FetchBaseQueryError | SerializedError}>;
  update?: (data: T) => Promise<{data?: T, error?: FetchBaseQueryError | SerializedError}>;
  remove?: (data: T) => Promise<{data?: T, error?: FetchBaseQueryError | SerializedError}>;
  onFormSelect?: (data: T) => T;
  onFormClear?: (data: T) => T;
  onFormSubmit?: (data: T) => T;
}

const DataTable: FC<IProps<any>> = (props) => {
  const [api, contextHolder] = notification.useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!props.form)
      return;

    let formData;

    if (props.selectedRow) {
      formData = {...props.selectedRow}
      formData = props.onFormSelect ? props.onFormSelect(formData) : formData;
    }
    else {
      formData = {id: 0}
      formData = props.onFormClear ? props.onFormClear(formData) : formData;
    }

    props.form.resetFields();
    props.form.setFieldsValue(formData)
  }, [props, props.form, props.selectedRow]);

  const onAdd = () => {
    props.setSelectedRow?.(undefined);
    setIsModalOpen(true);
  }

  const onCopy = () => {
    props.setSelectedRow?.({...props.selectedRow, id: 0});
    setIsModalOpen(true);
  }

  const onEdit = () => {
    setIsModalOpen(true);
  }

  const onDelete = () => {
    props.remove?.(props.selectedRow!)
    props.setSelectedRow?.(undefined)
  }

  const onFormSubmit = (formData: any) => {
    if (!props.create || !props.update || !props.remove)
      return;

    const id = props.selectedRow ? props.selectedRow.id : 0;
    const action = id === 0 ? props.create : props.update;

    formData = {...formData, id: id};

    formData = props.onFormSubmit ? props.onFormSubmit(formData) : formData;

    setIsModalOpen(false);

    action(formData)
      .then(() => {
        props.setSelectedRow?.(undefined);
      })
      .catch((error) => {
        error= (error as FetchBaseQueryError).data as IError;

        console.error("Request error", error);

        api.error({
          message: `${id === 0 ? "Create" : "Update"} error`,
          description: error?.message ?? "Unknown"
        })
      });
  }

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{width: "100%"}}>
        <Space wrap>
          {props.isEditable &&
            <>
              <Button icon={<PlusOutlined/>} onClick={onAdd}>
                  Add
              </Button>
              <Button icon={<CopyOutlined/>} onClick={onCopy} disabled={props.selectedRow === undefined}>
                  Copy
              </Button>
              <Button icon={<EditOutlined/>} onClick={onEdit} disabled={props.selectedRow === undefined}>
                  Edit
              </Button>
              <Popconfirm
                title="Delete this row"
                description="Are you sure to delete this row?"
                onConfirm={onDelete}
              >
                <Button icon={<DeleteOutlined/>} disabled={props.selectedRow === undefined} danger>
                    Delete
                </Button>
              </Popconfirm>
            </>
          }
          <Button icon={<ReloadOutlined/>} onClick={props.onUpdate}>
            Update
          </Button>
        </Space>
        {props.selectedRow &&
          <Alert message={"Row selected"} closable afterClose={() => props.setSelectedRow?.(undefined)}/>
        }
        <Table
          columns={props.columns}
          dataSource={props.data}
          loading={props.isLoading}
          size="small"
          scroll={{x: "auto"}}
          pagination={props.pagination === true && {pageSize: 30}}
          bordered={props.bordered}
          rowKey={(record) => record.id}
          rowSelection={props.isSelectable ? {
            type: "radio",
            onSelect: (value) => props.setSelectedRow?.(value),
            selectedRowKeys: [props.selectedRow?.id ?? ""]
          } : undefined}
        />
      </Space>
      {props.isEditable &&
        <Modal
          forceRender
          title="Edit"
          open={isModalOpen}
          closable={false}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => {props.form?.submit()}}
        >
          <Form form={props.form} onFinish={onFormSubmit}>
            {props.children}
          </Form>
        </Modal>
      }
    </>
  );
};

export default DataTable;
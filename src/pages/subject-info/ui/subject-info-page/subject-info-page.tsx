import {FC, useState} from "react";
import {Card, Form, Input, InputNumber, Tag} from "antd";
import {ISubject, subjectApi} from "@/entities/subject";
import {ColumnsType} from "antd/es/table";
import {DataTable} from "@/widgets/data-table";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const SubjectInfoPage: FC = () => {
  useSetPageTitle("Subject information page");

  const [form] = Form.useForm();

  const [selected, setSelected] = useState<ISubject | undefined>();

  const subjects = subjectApi.useGetSubjectsQuery();

  const [create] = subjectApi.useCreateSubjectMutation();
  const [update] = subjectApi.useUpdateSubjectMutation();
  const [remove] = subjectApi.useDeleteSubjectMutation();

  const columns: ColumnsType<ISubject> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Short Name",
      dataIndex: "shortName",
      key: "shortName",
    },
    {
      title: "Laboratory Count",
      dataIndex: "laboratoryCount",
      key: "laboratoryCount",
      render: (_, row) => {
        return row.laboratoryCount === 0 ?
          <Tag color="red">None</Tag> :
          row.laboratoryCount;
      }
    },
    {
      title: "Practical Count",
      dataIndex: "practicalCount",
      key: "practicalCount",
      render: (_, row) => {
        return row.practicalCount === 0 ?
          <Tag color="red">None</Tag> :
          row.practicalCount;
      }
    },
  ];

  const onUpdate = () => {
    subjects.refetch();
  }

  return (
    <Card bordered={false}>
      <DataTable
        columns={columns}
        data={subjects.data}
        isLoading={subjects.isLoading}
        onUpdate={onUpdate}
        isEditable
        isSelectable
        pagination
        create={async (data: ISubject) => create(data)}
        update={async (data: ISubject) => update(data)}
        remove={async (data: ISubject) => remove(data.id)}
        form={form}
        selectedRow={selected}
        setSelectedRow={setSelected}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="shortName" label="Short Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="laboratoryCount" label="Laboratory Count" rules={[{required: true}]}>
          <InputNumber min={0} style={{width: "100%"}}/>
        </Form.Item>
        <Form.Item name="practicalCount" label="Practical Count" rules={[{required: true}]}>
          <InputNumber min={0} style={{width: "100%"}}/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default SubjectInfoPage;
import {FC, useState} from "react";
import {Card, Form, Input} from "antd";
import {ITeacher} from "@/entities/teacher";
import {teacherApi} from "@/entities/teacher/api/teacher-api.ts";
import {ColumnsType} from "antd/es/table";
import {DataTable} from "@/widgets/data-table";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const TeacherInfoPage: FC = () => {
  useSetPageTitle("Teacher information page");

  const [form] = Form.useForm();

  const [selected, setSelected] = useState<ITeacher | undefined>();

  const teachers = teacherApi.useGetTeachersQuery();

  const [create] = teacherApi.useCreateTeacherMutation();
  const [update] = teacherApi.useUpdateTeacherMutation();
  const [remove] = teacherApi.useDeleteTeacherMutation();

  const columns: ColumnsType<ITeacher> = [
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Patronymic",
      dataIndex: "patronymic",
      key: "patronymic",
    },
    {
      title: "Contact Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
    },
    {
      title: "Telegram Nickname",
      dataIndex: "telegramNickname",
      key: "telegramNickname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Fit Email",
      dataIndex: "fitEmail",
      key: "fitEmail",
    }
  ];

  const onUpdate = () => {
    teachers.refetch();
  }

  return (
    <Card bordered={false}>
      <DataTable
        columns={columns}
        data={teachers.data}
        isLoading={teachers.isLoading}
        onUpdate={onUpdate}
        isEditable
        isSelectable
        pagination
        create={async (data: ITeacher) => create(data)}
        update={async (data: ITeacher) => update(data)}
        remove={async (data: ITeacher) => remove(data.id)}
        form={form}
        selectedRow={selected}
        setSelectedRow={setSelected}
      >
        <Form.Item name="surname" label="Surname" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="patronymic" label="Patronymic" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="contactPhone" label="Contact Phone">
          <Input/>
        </Form.Item>
        <Form.Item name="telegramNickname" label="Telegram Nickname">
          <Input/>
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input/>
        </Form.Item>
        <Form.Item name="fitEmail" label="Fit Email">
          <Input/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default TeacherInfoPage;
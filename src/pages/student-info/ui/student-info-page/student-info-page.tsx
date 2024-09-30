import {FC, useMemo, useState} from "react";
import {Card, DatePicker, Form, Input, InputNumber, Select, Tag} from "antd";
import {IStudent, studentApi} from "@/entities/student";
import {subgroupApi} from "@/entities/subgroup";
import {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";
import {DataTable} from "@/widgets/data-table";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const StudentInfoPage: FC = () => {
  useSetPageTitle("Student information page");

  const [form] = Form.useForm();

  const [selected, setSelected] = useState<IStudent | undefined>();

  const students = studentApi.useGetStudentsQuery();
  const subgroups = subgroupApi.useGetSubgroupsQuery();

  const [create] = studentApi.useCreateStudentMutation();
  const [update] = studentApi.useUpdateStudentMutation();
  const [remove] = studentApi.useDeleteStudentMutation();

  const subgroupsMap = useMemo(() => {
    if (!subgroups.data)
      return;

    return Object.fromEntries(subgroups.data!.map(item => {
      return [[item.id], item];
    }));
  }, [subgroups.data]);

  const maxIndex = useMemo(() => {
    return students.data ? Math.max(...students.data.map(x => x.index)) : 1;
  }, [students.data]);

  const columns: ColumnsType<IStudent> = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.surname.localeCompare(b.surname),
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
      sorter: (a, b) => a.surname.localeCompare(b.surname),
    },
    {
      title: "Patronymic",
      dataIndex: "patronymic",
      key: "patronymic",
      sorter: (a, b) => a.surname.localeCompare(b.surname),
    },
    {
      title: "Subgroup",
      dataIndex: "subgroupId",
      key: "subgroup",
      filters: subgroups.data?.map(x => ({text: x.name, value: x.id})),
      onFilter: (value, record) => record.subgroupId == value,
      sorter: (a, b) => subgroupsMap[a.subgroupId].index - subgroupsMap[b.subgroupId].index,
      render: (subgroupId: number) => {
        if (!subgroupsMap)
          return subgroupId;

        const subgroup = subgroupsMap[subgroupId]
        return (
          <Tag color="blue">
            {subgroup === undefined ? "None" : subgroup.name}
          </Tag>
        );
      }
    },
    {
      title: "Contact Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
    },
    {
      title: "Telegram Phone",
      dataIndex: "telegramPhone",
      key: "telegramPhone",
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
    },
    {
      title: "Telegram Nickname",
      dataIndex: "telegramNickname",
      key: "telegramNickname",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      ellipsis: true
    },
  ];

  const onUpdate = () => {
    subgroups.refetch();
    students.refetch();
  }

  const onFormSelect = (data: IStudent) => {
    return {
      ...data,
      subgroupId: data.subgroupId == undefined ? -1 : data.subgroupId,
      birthday: dayjs(data.birthday, "YYYY-MM-DD")
    }
  }

  const onFormClear = (data: object) => {
    return {
      ...data,
      subgroupId: -1,
      index: maxIndex + 1,
      birthday: dayjs("2004-01-01", "YYYY-MM-DD")
    }
  }

  const onFormSubmit = (data: IStudent) => {
    return {
      ...data,
      subgroupId: data.subgroupId === -1 ? undefined : data.subgroupId,
      birthday: dayjs(data.birthday).format("YYYY-MM-DD").toString()
    }
  }

  return (
    <Card bordered={false}>
      <DataTable
        columns={columns}
        data={students.data}
        isLoading={subgroups.isLoading || students.isLoading}
        onUpdate={onUpdate}
        isEditable
        isSelectable
        pagination
        create={async (data: IStudent) => create(data)}
        update={async (data: IStudent) => update(data)}
        remove={async (data: IStudent) => remove(data.id)}
        form={form}
        selectedRow={selected}
        setSelectedRow={setSelected}
        onFormSelect={onFormSelect}
        onFormClear={onFormClear}
        onFormSubmit={onFormSubmit}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="surname" label="Surname" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="patronymic" label="Patronymic" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="index" label="Index" rules={[{required: true}]}>
          <InputNumber min={1} style={{ width: '100%' }}/>
        </Form.Item>
        <Form.Item name="subgroupId" label="Subgroup">
          <Select
            placeholder="Select subgroup"
            options={[{value: -1, label: "None"}, ...subgroups?.data?.map((value) => ({value: value.id, label: value.name})) ?? []]}
          />
        </Form.Item>
        <Form.Item name="contactPhone" label="Contact Phone" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="telegramPhone" label="Telegram Phone" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="fitEmail" label="Fit Email" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="telegramNickname" label="Telegram Nickname">
          <Input/>
        </Form.Item>
        <Form.Item name="birthday" label="Birthday" rules={[{required: true}]}>
          <DatePicker format={"YYYY-MM-DD"} style={{ width: '100%' }}/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default StudentInfoPage;
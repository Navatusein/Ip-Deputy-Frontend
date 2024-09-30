import {FC, useMemo, useState} from "react";
import {studentApi} from "@/entities/student";
import {Card, Form, Input, Select} from "antd";
import moment from "moment-timezone";
import {IStudentTelegram, studentTelegramApi} from "@/entities/student-telegram";
import {ColumnsType} from "antd/es/table";
import {DataTable} from "@/widgets/data-table";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const TIME_ZONE = import.meta.env.VITE_TIME_ZONE;

const TelegramInfoPage: FC = () => {
  useSetPageTitle("Telegram information page");

  const [form] = Form.useForm();

  const [selected, setSelected] = useState<IStudentTelegram | undefined>();

  const students = studentApi.useGetStudentsQuery();
  const studentsTelegram = studentTelegramApi.useGetStudentTelegramsQuery();

  const [create] = studentTelegramApi.useCreateStudentTelegramMutation();
  const [update] = studentTelegramApi.useUpdateStudentTelegramMutation();
  const [remove] = studentTelegramApi.useDeleteStudentTelegramMutation();

  const studentsMap = useMemo(() => {
    if (!students.data)
      return;

    return Object.fromEntries(students.data!.map(item => {
      return [[item.id], item];
    }));
  }, [students.data]);

  const columns: ColumnsType<IStudentTelegram> = [
    {
      title: "Name",
      key: "name",
      render: (_, value) => (!studentsMap ? value.studentId : studentsMap[value.studentId].name)
    },
    {
      title: "Surname",
      key: "surname",
      render: (_, value) => (!studentsMap ? value.studentId : studentsMap[value.studentId].surname)
    },
    {
      title: "Patronymic",
      key: "patronymic",
      render: (_, value) => (!studentsMap ? value.studentId : studentsMap[value.studentId].patronymic)
    },
    {
      title: "Telegram Id",
      dataIndex: "telegramId",
      key: "telegramId",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Schedule Compact",
      dataIndex: "scheduleCompact",
      key: "scheduleCompact",
      render: (_, value) => (value.scheduleCompact ? "true" : "false")
    },
    {
      title: "Last Activity",
      dataIndex: "lastActivityDiff",
      key: "lastActivityDiff",
      ellipsis: true,
      render: (_, value) => (value.lastActivity ? moment.utc(value.lastActivity).tz(TIME_ZONE).fromNow() : "")
    },
  ];

  const onUpdate = () => {
    studentsTelegram.refetch();
    students.refetch();
  }

  const onFormSubmit = (data: IStudentTelegram) => {
    return {...data, language: "uk", scheduleCompact: false}
  }

  return (
    <Card bordered={false}>
      <DataTable
        columns={columns}
        data={studentsTelegram.data}
        isLoading={studentsTelegram.isLoading || students.isLoading}
        onUpdate={onUpdate}
        isEditable
        isSelectable
        pagination
        create={async (data: IStudentTelegram) => create(data)}
        update={async (data: IStudentTelegram) => update(data)}
        remove={async (data: IStudentTelegram) => remove(data.id)}
        form={form}
        selectedRow={selected}
        setSelectedRow={setSelected}
        onFormSubmit={onFormSubmit}
      >
        <Form.Item name="studentId" label="Student" rules={[{required: true}]}>
          <Select
            placeholder="Select student"
            options={students.data?.filter(x => !studentsTelegram.data?.find(y => y.studentId == x.id)).map((value) => {
              return {value: value.id, label: `${value.surname} ${value.name}`}
            })}
          />
        </Form.Item>
        <Form.Item name="telegramId" label="Telegram Id" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default TelegramInfoPage;
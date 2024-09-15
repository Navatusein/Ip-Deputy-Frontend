import {FC, useMemo, useState} from "react";
import {Button, Card, Form, Input, Select, Space, Tag} from "antd";
import {ISubmissionsConfig, submissionConfigApi} from "@/entities/submission";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {subgroupApi} from "@/entities/subgroup";
import {ColumnsType} from "antd/es/table";
import {DataTable} from "@/widgets/data-table";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const SubmissionConfigPage: FC = () => {
  const [form] = Form.useForm();

  const [selected, setSelected] = useState<ISubmissionsConfig | undefined>();

  const submissionsConfigs = submissionConfigApi.useGetSubmissionsConfigsQuery();
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();

  const [create] = submissionConfigApi.useCreateSubmissionsConfigMutation();
  const [update] = submissionConfigApi.useUpdateSubmissionsConfigMutation();
  const [remove] = submissionConfigApi.useDeleteSubmissionsConfigMutation();

  const subgroupsMap = useMemo(() => {
    if (!subgroups.data)
      return;

    return Object.fromEntries(subgroups.data!.map(item => {
      return [[item.id], item];
    }));
  }, [subgroups.data]);

  const subjectsMap = useMemo(() => {
    if (!subjects.data)
      return;

    return Object.fromEntries(subjects.data!.map(item => {
      return [[item.id], item];
    }));
  }, [subjects.data]);

  const subjectTypesMap = useMemo(() => {
    if (!subjectTypes.data)
      return;

    return Object.fromEntries(subjectTypes.data!.map(item => {
      return [[item.id], item];
    }));
  }, [subjectTypes.data]);

  const columns: ColumnsType<ISubmissionsConfig> = [
    {
      title: "Subject",
      dataIndex: "subjectId",
      key: "subjectId",
      render: (_, row) => (row.subjectId && subjectsMap && subjectsMap[row.subjectId]?.shortName)
    },
    {
      title: "Subject Type",
      dataIndex: "subjectTypeId",
      key: "subjectTypeId",
      render: (_, row) => (row.subjectTypeId && subjectTypesMap && subjectTypesMap[row.subjectTypeId]?.name)
    },
    {
      title: "Custom Name",
      dataIndex: "customName",
      key: "customName",
    },
    {
      title: "Custom Type",
      dataIndex: "customType",
      key: "customType",
    },
    {
      title: "For who",
      dataIndex: "subgroupId",
      key: "subgroupId",
      render: (_, row) => (
        <Tag color="blue">
          {row.subgroupId === null ? "Whole group" : subgroupsMap[row.subgroupId!].name}
        </Tag>
      )
    },
    {
      title: "Submission Works",
      dataIndex: "submissionWorks",
      key: "submissionWorks",
      render: (_, row) => row.submissionWorks.map((value) => (
        <Tag color="blue" key={value.id}>{value.name}</Tag>
      ))
    }
  ];

  const onUpdate = () => {
    submissionsConfigs.refetch();
    subjects.refetch();
    subjectTypes.refetch();
    subgroups.refetch();
  }

  const onFormSelect = (data: ISubmissionsConfig) => {
    return {
      ...data,
      subgroupId: data.subgroupId == undefined ? -1 : data.subgroupId,
    }
  }

  const onFormSubmit = (data: ISubmissionsConfig) => {
    return {
      ...data,
      subgroupId: data.subgroupId === -1 ? undefined : data.subgroupId,
      submissionWorks: data.submissionWorks?.map((value, index) => {return { id: value.id, name: value.name, index: index}}) ?? []
    };
  };

  return (
    <Card bordered={false}>
      <DataTable
        columns={columns}
        data={submissionsConfigs.data}
        isLoading={submissionsConfigs.isLoading || subgroups.isLoading || subjects.isLoading || subjectTypes.isLoading}
        onUpdate={onUpdate}
        isEditable
        isSelectable
        pagination
        create={async (data: ISubmissionsConfig) => create(data)}
        update={async (data: ISubmissionsConfig) => update(data)}
        remove={async (data: ISubmissionsConfig) => remove(data.id)}
        form={form}
        selectedRow={selected}
        setSelectedRow={setSelected}
        onFormSelect={onFormSelect}
        onFormSubmit={onFormSubmit}
      >
        <Form.Item name="subjectId" label="Subject">
          <Select
            placeholder="Select subject"
            options={subjects?.data?.map((value) => ({value: value.id, label: value.name}))}
          />
        </Form.Item>
        <Form.Item name="subjectTypeId" label="SubjectType">
          <Select
            placeholder="Select subject type"
            options={subjectTypes?.data?.map((value) => ({value: value.id, label: value.name}))}
          />
        </Form.Item>
        <Form.Item name="customName" label="Custom Name">
          <Input/>
        </Form.Item>
        <Form.Item name="customType" label="Custom Type">
          <Input/>
        </Form.Item>
        <Form.Item name="subgroupId" label="Fow Who" rules={[{required: true}]}>
          <Select
            placeholder="Select for who"
            options={[{value: -1, label: "Whole group"}, ...subgroups?.data?.map((value) => ({value: value.id, label: value.name})) ?? []]}
          />
        </Form.Item>
        <Form.List name="submissionWorks">
          {(fields, {add, remove}) => (
            <>
              <Form.Item>
                <Button onClick={add} block icon={<PlusOutlined/>}>
                  Add work
                </Button>
              </Form.Item>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...restField} name={[name, "name"]} label={`Work ${key + 1}`}>
                    <Input/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}/>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </DataTable>
    </Card>
  );
};

export default SubmissionConfigPage;
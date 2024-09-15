import {FC, useMemo, useState} from "react";
import {Button, Card, Popconfirm, Select, Space, Table, Tag} from "antd";
import {ISubmissionsConfig, PreferredPosition, submissionConfigApi, submissionStudentApi} from "@/entities/submission";
import {subgroupApi} from "@/entities/subgroup";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {studentApi} from "@/entities/student";
import {ColumnsType} from "antd/es/table";
import {CloseOutlined, DeleteOutlined, ReloadOutlined} from "@ant-design/icons";

interface ISubmission {
  id: number;
  studentId: number;
  name: string;
  index: number;
}

interface ISubmissionListItem {
  studentId: number;
  student: string;
  fistSubmittedAt: string;
  lastSubmittedAt: string;
  preferredPosition: PreferredPosition;
  submissions: ISubmission[];
  submissionConfigId: number;
}

const SubmissionInfoPage: FC = () => {

  const submissionsConfigs = submissionConfigApi.useGetSubmissionsConfigsQuery();
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();
  const students = studentApi.useGetStudentsQuery();

  const [remove] =  submissionStudentApi.useDeleteSubmissionStudentMutation();

  const [submissionsConfigId, setSubmissionsConfigId] = useState<number | undefined>(undefined);

  const submissionsConfigsMap = useMemo(() => {
    if (!submissionsConfigs.data)
      return;

    return Object.fromEntries(submissionsConfigs.data!.map(item => {
      return [[item.id], item];
    }));
  }, [submissionsConfigs.data]);

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

  const studentsMap = useMemo(() => {
    if (!students.data)
      return;

    return Object.fromEntries(students.data!.map(item => {
      return [[item.id], item];
    }));
  }, [students.data]);

  const submissionsConfigsOptions = useMemo(() => {
    if (!subgroupsMap || !subjectTypesMap || !subgroupsMap)
      return [];

    return submissionsConfigs.data?.map((value) => {
      const name = value.customName != undefined ? value.customName : subjectsMap[value.subjectId!].shortName ?? subjectsMap[value.subjectId!].name;
      const type = value.customType != undefined ? value.customType : subjectTypesMap[value.subjectTypeId!].shortName;
      const subgroupName = value.subgroupId != undefined ? subgroupsMap[value.subgroupId!].name : "";

      return {value: value.id, label: `${name} (${type}) ${subgroupName}`}
    })
  }, [submissionsConfigs.data, subjectsMap, subjectTypesMap, subgroupsMap])

  const columns: ColumnsType<ISubmissionListItem> = [
    {
      title: "Student",
      dataIndex: "studentId",
      key: "studentId",
      ellipsis: true,
      render: (_, row) => {
        return row.student;
      }
    },
    {
      title: "Preferred Position",
      dataIndex: "preferredPosition",
      key: "preferredPosition",
      ellipsis: true,
      render: (_, row) => (
        <Tag color="blue">{PreferredPosition[row.preferredPosition]}</Tag>
      ),
    },
    {
      title: "Fist Submitted At",
      dataIndex: "fistSubmittedAt",
      key: "fistSubmittedAt",
      ellipsis: true
    },
    {
      title: "Last Submitted At",
      dataIndex: "lastSubmittedAt",
      key: "lastSubmittedAt",
      ellipsis: true
    },
    {
      title: "Submission Works",
      dataIndex: "submissionWorks",
      key: "submissionWorks",
      ellipsis: true,
      render: (_, row) => row.submissions.map((value, index) => {
        return (
          <Tag
            color="blue"
            closable
            key={index}
            onClose={(e) => e.preventDefault()}
            closeIcon={
              <Popconfirm title="Delete" description="Are you sure to delete this submission?" onConfirm={() => onWorkRemove(value.id)}>
                <CloseOutlined/>
              </Popconfirm>
            }
          >
            {value.name}
          </Tag>
        );
      }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, row) => (
        <Popconfirm title="Delete" description="Are you sure to delete this student?" onConfirm={() => onStudentRemove(row.submissions)}>
          <Button danger size="small" icon={<DeleteOutlined/>}>
            Delete
          </Button>
        </Popconfirm>
      ),
      width: 100
    }
  ];

  const submissionStudents = useMemo(() => {
    if (!submissionsConfigId)
      return [];

    const submissionsConfig: ISubmissionsConfig = submissionsConfigsMap[submissionsConfigId];

    const submissionWorksMap = Object.fromEntries(submissionsConfig.submissionWorks.map(item => {
      return [[item.id], item];
    }));

    const sorted = [...submissionsConfig.submissionStudents].sort((a, b) => a.preferredPosition - b.preferredPosition);

    const studentIds = sorted
      .map(item => item.studentId)
      .filter((value, index, self) => self.indexOf(value) === index);

    let list: ISubmissionListItem[] = [];

    studentIds.forEach(studentId => {
      const student = studentsMap[studentId];
      const submissions = submissionsConfig.submissionStudents
        .filter(x => x.studentId == studentId)
        .sort((a, b) => a.id - b.id)

      const submissionListItem: ISubmissionListItem = {
        studentId: studentId,
        student: `${student?.surname} ${student?.name}`,
        fistSubmittedAt: submissions[0].submittedAt,
        lastSubmittedAt: submissions[submissions.length - 1].submittedAt,
        preferredPosition: submissions[0].preferredPosition,
        submissions: submissions
          .map(x => ({
            id: x.id,
            studentId: studentId,
            name: submissionWorksMap[x.submissionWorkId].name,
            index: submissionWorksMap[x.submissionWorkId].index}
          ))
          .sort((a, b) => a.index - b.index),
        submissionConfigId: submissionsConfig.id
      }

      list = [...list, submissionListItem];
    });

    return list;
  },[studentsMap, submissionsConfigsMap, submissionsConfigId])


  const onWorkRemove = (id: number) => {
    remove(id);
  }

  const onStudentRemove = (submissions: ISubmission[]) => {
    submissions.forEach(value => {
      remove(value.id);
    })
  }

  const onClear = () => {
    if (!submissionsConfigId)
      return;

    const submissionsConfig: ISubmissionsConfig = submissionsConfigsMap[submissionsConfigId];

    submissionsConfig.submissionStudents.forEach(value => {
      remove(value.id);
    })
  }

  const onUpdate = () => {
    submissionsConfigs.refetch();
    subgroups.refetch();
    subjects.refetch();
    subjectTypes.refetch();
    students.refetch();
  }

  return (
    <Card bordered={false}>
      <Space direction="vertical" style={{width: "100%"}}>
        <Space>
          <Select
            placeholder="Select submission config"
            value={submissionsConfigId}
            onChange={(value) => setSubmissionsConfigId(value)}
            options={submissionsConfigsOptions}
          />
          <Button icon={<ReloadOutlined/>} onClick={onUpdate}>
            Update
          </Button>
          <Popconfirm title="Clear" description="Are you sure to clear list?" onConfirm={() => onClear()}>
            <Button danger icon={<DeleteOutlined/>} onClick={onUpdate} disabled={submissionStudents.length === 0}>
              Clear
            </Button>
          </Popconfirm>
        </Space>
        <Table
          dataSource={submissionStudents}
          columns={columns}
          size="small"
          scroll={{x: "auto"}}
          pagination={false}
          rowKey={(record) => record.studentId}
        />
      </Space>
    </Card>
  );
};

export default SubmissionInfoPage;
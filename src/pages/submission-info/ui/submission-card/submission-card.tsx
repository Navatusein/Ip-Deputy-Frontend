import {FC, useMemo} from "react";
import {Button, Popconfirm, Space, Table, TableColumnsType, Tag} from "antd";
import {DeleteOutlined, ReloadOutlined} from "@ant-design/icons";
import {ISubmissionsConfig, submissionConfigApi, submissionStudentApi} from "@/entities/submission";
import {subgroupApi} from "@/entities/subgroup";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {studentApi} from "@/entities/student";
import {ISubmissionItem, ISubmissionListItem} from "@/pages/submission-info";

export interface IProps {
  submissionsConfig?: ISubmissionsConfig;
}

const preferredPositionMap = {
  [-1]: "Very Begin",
  [0]: "Begin",
  [1]: "No Matter",
  [2]: "End",
  [3]: "Other Subgroup"
}

const SubmissionCard: FC<IProps> = (props) => {
  const submissionsConfigs = submissionConfigApi.useGetSubmissionsConfigsQuery();
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();
  const students = studentApi.useGetStudentsQuery();

  const [remove] =  submissionStudentApi.useDeleteSubmissionStudentMutation();

  const studentsMap = useMemo(() => {
    if (!students.data)
      return;

    return Object.fromEntries(students.data!.map(item => {
      return [[item.id], item];
    }));
  }, [students.data]);

  const submissionStudents = useMemo(() => {
    if (!props.submissionsConfig || !studentsMap)
      return;

    const submissionWorksMap = Object.fromEntries(props.submissionsConfig.submissionWorks.map(item => {
      return [[item.id], item];
    }));

    const sorted = [...props.submissionsConfig.submissionStudents].sort((a, b) => a.preferredPosition - b.preferredPosition);

    const studentIds = sorted
      .map(item => item.studentId)
      .filter((value, index, self) => self.indexOf(value) === index);

    let list: ISubmissionListItem[] = [];

    studentIds.forEach(studentId => {
      const student = studentsMap[studentId];
      const submissions = props.submissionsConfig!.submissionStudents
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
            index: submissionWorksMap[x.submissionWorkId].index,
            submittedAt: x.submittedAt
          }))
          .sort((a, b) => a.index - b.index),
        submissionConfigId: props.submissionsConfig!.id
      }

      list = [...list, submissionListItem];
    });

    return list;
  },[studentsMap, props.submissionsConfig])

  const columns: TableColumnsType<ISubmissionListItem> = [
    {
      title: "Student",
      dataIndex: "studentId",
      key: "studentId",
      ellipsis: true,
      width: "200px",
      render: (_, row) => {
        return row.student;
      }
    },
    {
      title: "Preferred Position",
      dataIndex: "preferredPosition",
      key: "preferredPosition",
      ellipsis: true,
      width: "140px",
      render: (_, row) => (
        <>
          <Tag color="blue" style={{margin: 0}}>
            {preferredPositionMap[row.preferredPosition] ?? `Other: ${row.preferredPosition}`}
          </Tag>
          {/*<Button size="small" type="text" icon={<EditOutlined/>}/>*/}
        </>

      ),
    },
    {
      title: "Fist Submitted At",
      dataIndex: "fistSubmittedAt",
      key: "fistSubmittedAt",
      ellipsis: true,
      width: "140px",
    },
    {
      title: "Last Submitted At",
      dataIndex: "lastSubmittedAt",
      key: "lastSubmittedAt",
      ellipsis: true,
      width: "140px",
    },
    {
      title: "Submission Works",
      dataIndex: "submissionWorks",
      key: "submissionWorks",
      render: (_, row) => row.submissions.map((value, index) => {
        return (
          <Tag color="blue" key={index}>
            {value.name}
          </Tag>
        );
      }),
    },
    {
      title: "Action",
      key: "action",
      width: "93px",
      render: (_, row) => (
        <Popconfirm title="Delete" description="Are you sure to delete this student?" onConfirm={() => onStudentRemove(row.submissions)}>
          <Button danger size="small" icon={<DeleteOutlined/>}>
            Delete
          </Button>
        </Popconfirm>
      )
    }
  ];

  const expandColumns: TableColumnsType<ISubmissionItem> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "40px"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "140px",
      render: (_, row) => (
       <Tag color="blue" key={row.id}>{row.name}</Tag>
      )
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: "140px"
    },
    {
      title: "Action",
      key: "action",
      width: "93px",
      render: (_, row) => (
        <Popconfirm title="Delete" description="Are you sure to delete this submissin?" onConfirm={() => onWorkRemove(row.id)}>
          <Button danger size="small" icon={<DeleteOutlined/>}>
            Delete
          </Button>
        </Popconfirm>
      )
    },
    {
      title: "",
      dataIndex: "",
      key: "empty"
    },
  ]

  const onWorkRemove = (id: number) => {
    remove(id);
  }

  const onStudentRemove = (submissions: ISubmissionItem[]) => {
    submissions.forEach(value => {
      remove(value.id);
    })
  }

  const onClear = () => {
    if (!props.submissionsConfig)
      return;

    props.submissionsConfig.submissionStudents.forEach(value => {
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
    <Space direction="vertical" style={{width: "100%"}}>
      <Space>
        <Button icon={<ReloadOutlined/>} onClick={onUpdate}>
          Update
        </Button>
        <Popconfirm title="Clear" description="Are you sure to clear list?" onConfirm={() => onClear()}>
          <Button danger icon={<DeleteOutlined/>} onClick={onUpdate} disabled={props.submissionsConfig?.submissionStudents.length === 0}>
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
        expandable={{expandedRowRender: (record: ISubmissionListItem) => (
          <Table
            columns={expandColumns}
            dataSource={record.submissions}
            pagination={false}
          />
        )}}
      />
    </Space>
  );
};

export default SubmissionCard;
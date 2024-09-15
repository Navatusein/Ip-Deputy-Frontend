import {FC, useMemo, useState} from "react";
import {submissionConfigApi, submissionStudentApi} from "@/entities/submission";
import {subgroupApi} from "@/entities/subgroup";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {useOutletContext} from "react-router-dom";
import {IBotLayoutContext} from "@/shared/types/types.ts";
import {Button, Card, Flex, List, Select, Space, Typography} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {studentApi} from "@/entities/student";

const IS_DEV_ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT === "Development";

const {Title, Text} = Typography;

const SubmissionStudentPage: FC = () => {
  const {telegram, user} = useOutletContext<IBotLayoutContext>();

  const [studentId, setStudentId] = useState(user.studentId);

  const submissionsConfigs = submissionConfigApi.useGetSubmissionsConfigsForStudentQuery({studentId: studentId, otherSubgroups: true});
  const submissionStudents = submissionStudentApi.useGetSubmissionStudentsByStudentIdQuery(studentId);
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();

  const students = studentApi.useGetStudentsQuery();

  const [update] = submissionStudentApi.useUpdateSubmissionStudentMutation();
  const [remove] = submissionStudentApi.useDeleteSubmissionStudentMutation();

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

  const submissionsConfigsOptions = useMemo(() => {
    if (!subgroupsMap || !subjectTypesMap || !subgroupsMap)
      return [];

    return submissionsConfigs.data?.filter(x => x.submissionStudents.length !== 0).map((value) => {
      const name = value.customName != undefined ? value.customName : subjectsMap[value.subjectId!].shortName ?? subjectsMap[value.subjectId!].name;
      const type = value.customType != undefined ? value.customType : subjectTypesMap[value.subjectTypeId!].shortName;
      const subgroupName = value.subgroupId != undefined ? subgroupsMap[value.subgroupId!].name : "";

      const studentSubmissions = submissionStudents.data?.filter(x => x.submissionsConfigId === value.id);

      const preferredPosition = studentSubmissions?.[0]?.preferredPosition ?? undefined;

      const data = studentSubmissions?.map((submission) => {
        const submissionWork = value.submissionWorks.find(x => x.id === submission.submissionWorkId)!;
        return {id: submission.id, name: submissionWork.name, index: submissionWork.index}
      }).sort((a, b) => a.index - b.index)

      return {name: name, type: type, subgroup: subgroupName, data: data, preferredPosition: preferredPosition}
    })
  }, [submissionsConfigs.data, subjectsMap, subjectTypesMap, subgroupsMap, submissionStudents.data]);

  const onRemove = (id: number) => {
    telegram.showConfirm("Бажаете видалити запис?", (confirm: boolean) => {
      if (!confirm)
        return;

      remove(id).catch((error) => {
        if (error.response)
          telegram.showAlert(error.message);
      });
    });
  };

  const onPreferredPositionChange = (value: number, id: number) => {
    telegram.showConfirm("Бажаете змінити бажану позицію?", (confirm: boolean) => {
      if (!confirm)
        return;

      const submissionStudent = submissionStudents.data!.find(x => x.id === id)!;
      update({...submissionStudent, preferredPosition: value})
    });
  };

  return (
    <Card bordered={false}>
      <Title level={3}>Мої записи</Title>

      {IS_DEV_ENVIRONMENT &&
        <Select
          style={{width: "100%"}}
          placeholder="Студент"
          options={students.data?.map(value => ({
            label: `${value.surname} ${value.name}`,
            value: value.id
          }))}
          value={studentId}
          onChange={(value) => setStudentId(value)}
        />
      }

      <List
        dataSource={submissionsConfigsOptions}
        renderItem={(item) => (
          <List.Item>
            <Space direction="vertical" style={{width: "100%"}}>
              <Title level={4} style={{margin: 0}}>
                {`${item.name} (${item.type}) ${item.subgroup}`}
              </Title>
              <Flex style={{width: "100%"}} align="center" gap={15}>
                <Text style={{textWrap: "nowrap"}}>Бажана позиція:</Text>
                <Select
                  style={{width: "100%"}}
                  placeholder="Бажана позиція"
                  value={item.preferredPosition === undefined ? 1 : item.preferredPosition}
                  onChange={value => {onPreferredPositionChange(value, item.data![0].id)}}
                  disabled={item.preferredPosition === 3 || item.preferredPosition === undefined}
                  options={[
                    {value: 0, label: "На початку"},
                    {value: 1, label: "Без різниці"},
                    {value: 2, label: "В кінці"},
                    {value: 3, label: "Інша підгруппа", disabled: true}
                  ]}
                />
              </Flex>
              <List
                size="small"
                bordered
                dataSource={item.data}
                renderItem={(item) => (
                  <List.Item>
                    <Flex align="center" justify="space-between" style={{width: "100%"}}>
                      <Text>{item.name}</Text>
                      <Button danger size="small" icon={<DeleteOutlined/>} onClick={() => onRemove(item.id)}/>
                    </Flex>
                  </List.Item>
                )}
              />
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default SubmissionStudentPage;
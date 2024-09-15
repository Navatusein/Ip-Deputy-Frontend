import {FC, useEffect, useMemo, useState} from "react";
import {Card, Checkbox, Form, Select, Typography} from "antd";
import {ISubmissionStudent, submissionConfigApi, submissionStudentApi} from "@/entities/submission";
import {subgroupApi} from "@/entities/subgroup";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {useOutletContext} from "react-router-dom";
import {IBotLayoutContext} from "@/shared/types/types";
import {SelectList} from "@/features/select-list";
import {ISubmissionRegistrationForm} from "@/pages/submission-registration";
import dayjs from "dayjs";
import {studentApi} from "@/entities/student";

const IS_DEV_ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT === "Development";

const {Title} = Typography;

const SubmissionRegistrationPage: FC = () => {
  const {telegram, user} = useOutletContext<IBotLayoutContext>();

  const [studentId, setStudentId] = useState(user.studentId);

  const [form] = Form.useForm();

  const submissionConfigId = Form.useWatch("submissionConfigId", form);
  const submissionWorksId = Form.useWatch("submissionWorksId", form);

  const [otherSubgroups, setOtherSubgroups] = useState(false);

  const submissionsConfigs = submissionConfigApi.useGetSubmissionsConfigsForStudentQuery({studentId: studentId, otherSubgroups: otherSubgroups});
  const submissionStudents = submissionStudentApi.useGetSubmissionStudentsByStudentIdQuery(studentId);
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();

  const students = studentApi.useGetStudentsQuery();

  const [create] =  submissionStudentApi.useCreateSubmissionStudentMutation();

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

    return submissionsConfigs.data?.map((value) => {
      const name = value.customName != undefined ? value.customName : subjectsMap[value.subjectId!].shortName ?? subjectsMap[value.subjectId!].name;
      const type = value.customType != undefined ? value.customType : subjectTypesMap[value.subjectTypeId!].shortName;
      const subgroupName = value.subgroupId != undefined ? subgroupsMap[value.subgroupId!].name : "";

      return {value: value.id, label: `${name} (${type}) ${subgroupName}`}
    })
  }, [submissionsConfigs.data, subjectsMap, subjectTypesMap, subgroupsMap])

  const submissionWorksOptions = useMemo(() => {
    return submissionsConfigs.data?.find(x => x.id === submissionConfigId)?.submissionWorks.map((value) => {
      const submissionWork = submissionStudents?.data?.find(x => x.submissionWorkId == value.id);
      return {value: value.id, label: value.name, disabled: submissionWork !== undefined};
    })
  }, [submissionConfigId, submissionStudents.data, submissionsConfigs.data])

  useEffect(() => {
    telegram.MainButton.text = "Записатись"
    telegram.MainButton.onClick(() => {
      form.submit();
    })
  }, []);

  useEffect(() => {
    form.resetFields(["submissionWorksId"]);

    if (submissionConfigId)
      telegram.expand();

  }, [submissionConfigId]);

  useEffect(() => {
    telegram.MainButton.isVisible = submissionWorksId && submissionWorksId.length != 0;
  }, [submissionWorksId]);

  useEffect(() => {
    form.resetFields(["submissionConfigId"]);
  }, [otherSubgroups]);

  const onOtherSubgroups = (e: CheckboxChangeEvent) => {
    setOtherSubgroups(e.target.checked);
    submissionsConfigs.refetch();
    form.setFieldValue("preferredPosition", e.target.checked ? 3 : 1);
  }

  const onFormSubmit = (data: ISubmissionRegistrationForm) => {
    data.submissionWorksId.forEach((submissionWorkId) => {
      const submission: ISubmissionStudent = {
        id: 0,
        studentId: studentId,
        submissionsConfigId: data.submissionConfigId,
        submissionWorkId: submissionWorkId,
        preferredPosition: data.preferredPosition,
        submittedAt: dayjs(Date.now()).format("YYYY-MM-DD").toString()
      }

      create(submission).catch((error) => {
        if (error.response)
          telegram.showAlert(error.message);
      });
    })

    telegram.showPopup({
      title: "Успіх!",
      message: "Ви успішно записались на захист.",
      buttons: [
        {id: "Continue", type: "default", text: "Продовжити"},
        {id: "Close", type: "destructive", text: "Закрити"},
      ]
      }, (id: string) => {
        switch (id) {
          case "Continue":
            form.resetFields();
            break;
          case "Close":
            telegram.close();
            break;
        }
    });
  }

  return (
    <Card bordered={false}>
      <Title level={3}>Реестрація на захист</Title>

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

      <Form form={form} onFinish={onFormSubmit} initialValues={{preferredPosition: 1}}>
        <Form.Item
          name="submissionConfigId"
          label="Виберіть предмет:"
          rules={[{required: true, message: "Виберіть предмет"}]}
          style={{marginBottom: "10px"}}
        >
          <Select
            placeholder="Предмет"
            options={submissionsConfigsOptions}
          />
        </Form.Item>

        <Checkbox onChange={onOtherSubgroups} style={{marginBottom: "24px"}}>
          Показати інші підгруппи
        </Checkbox>

        <Form.Item
          name="preferredPosition"
          label="Виберіть бажану позицію:"
        >
          <Select
            placeholder="Бажана позиція"
            disabled={otherSubgroups}
            options={[
              {value: 0, label: "На початку"},
              {value: 1, label: "Без різниці"},
              {value: 2, label: "В кінці"},
              {value: 3, label: "Інша підгруппа", disabled: !otherSubgroups},
            ]}
          />
        </Form.Item>

        <Form.Item
          name="submissionWorksId"
          label="Виберіть роботи:"
          rules={[{required: true, message: "Виберіть роботи"}]}
          style={{marginBottom: 0}}
        >
          <SelectList
            options={submissionWorksOptions}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SubmissionRegistrationPage;
import {FC, useMemo, useState} from "react";
import {Button, Card, Empty, Input, Segmented, Space, Typography} from "antd";
import {submissionConfigApi} from "@/entities/submission";
import {subgroupApi} from "@/entities/subgroup";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {IFilterOptions, SubmissionCard} from "@/pages/submission-info";
import {ClearOutlined, FilterOutlined, SearchOutlined} from "@ant-design/icons";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const {Title} = Typography;

const SubmissionInfoPage: FC = () => {
  useSetPageTitle("Submission information page");

  const submissionsConfigs = submissionConfigApi.useGetSubmissionsConfigsQuery();
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({subgroupId: -2, search: ""})

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

  const subgroupsOptions = useMemo(() => {
    if (!subgroups.data)
      return[];

    return [
      {label: "All", value: -2},
      ...subgroups.data.map((subgroup) => ({label: subgroup.name, value: subgroup.id})),
      {label: "Whole group", value: -1}
    ];
  }, [subgroups.data]);

  const submissionsConfigsOptions = useMemo(() => {
    if (!subgroupsMap || !subjectTypesMap || !subgroupsMap)
      return [];

    return submissionsConfigs.data?.map((value) => {
        const name: string = value.customName != undefined ? value.customName : subjectsMap[value.subjectId!].shortName ?? subjectsMap[value.subjectId!].name;
        const type = value.customType != undefined ? value.customType : subjectTypesMap[value.subjectTypeId!].shortName;
        const subgroupName = value.subgroupId != undefined ? subgroupsMap[value.subgroupId!].name : "";

        if (!(value.subgroupId == filterOptions.subgroupId || (value.subgroupId == null && filterOptions.subgroupId == -1)) && filterOptions.subgroupId != -2)
          return undefined;

        if (!name.trim().toLowerCase().includes(filterOptions.search.trim().toLowerCase()))
          return undefined;

        return {value: value, label: `${name} (${type}) ${subgroupName}`, name: name};
      })
      .filter(x => x != undefined)

  }, [submissionsConfigs.data, subjectsMap, subjectTypesMap, subgroupsMap, filterOptions])

  return (
    <Space direction="vertical" style={{width: "100%"}} size="large">
      <Card bordered={false}>
        <Title level={4}>
          Sort options
        </Title>
        <Space style={{width: "100%"}} wrap>
          <Segmented
            options={subgroupsOptions}
            value={filterOptions.subgroupId}
            onChange={(value) => setFilterOptions({...filterOptions, subgroupId: value})}
          />
          <Input
            addonBefore={<SearchOutlined/>}
            placeholder="Search"
            value={filterOptions.search}
            onChange={(value) => setFilterOptions({...filterOptions, search: value.target.value})}
          />
          <Button onClick={() => setFilterOptions({subgroupId: -2, search: ""})} icon={<ClearOutlined/>}>
            Clear
          </Button>
        </Space>
      </Card>
      {submissionsConfigsOptions?.map((submissionsConfigOption) => (
        <Card bordered={false} key={submissionsConfigOption.value.id}>
          <Space direction="vertical" style={{width: "100%"}}>
            <Space align="center">
              <Button
                onClick={() => setFilterOptions({...filterOptions, search: submissionsConfigOption.name})}
                icon={<FilterOutlined/>}
              />
              <Title level={4} style={{margin: "0"}}>
                {submissionsConfigOption.label}
              </Title>
            </Space>
            <SubmissionCard submissionsConfig={submissionsConfigOption.value}/>
          </Space>
        </Card>
      ))}
      {submissionsConfigsOptions?.length == 0 &&
        <Card bordered={false}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        </Card>
      }
    </Space>
  );
};

export default SubmissionInfoPage;
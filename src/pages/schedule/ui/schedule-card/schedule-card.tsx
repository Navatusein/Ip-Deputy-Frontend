import {Dispatch, FC, SetStateAction, useMemo} from "react";
import {ICouple} from "@/entities/couple";
import {Flex, Radio, Space, Tag, theme, Typography} from "antd";
import {teacherApi} from "@/entities/teacher/api/teacher-api.ts";
import {subjectTypeApi} from "@/entities/subject-type";
import {subjectApi} from "@/entities/subject";

const {Text} = Typography;

export interface IProps {
  couple: ICouple;
  selectedCouple: ICouple | undefined;
  setSelectedCouple: Dispatch<SetStateAction<ICouple | undefined>>
}

const ScheduleCard: FC<IProps> = (props) => {

  const {token: {colorInfoBg, colorInfoBorder}} = theme.useToken();

  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();
  const teachers = teacherApi.useGetTeachersQuery();

  const subject = useMemo(() => {
    return subjects.data?.find(x => x.id === props.couple.subjectId);
  }, [subjects.data, props.couple]);

  const subjectType = useMemo(() => {
    return subjectTypes.data?.find(x => x.id === props.couple.subjectTypeId);
  }, [subjectTypes.data, props.couple]);

  const teacher = useMemo(() => {
    return teachers.data?.find(x => x.id === props.couple.teacherId);
  }, [teachers.data, props.couple]);

  const selectSchedule = () => {
    props.setSelectedCouple(props.couple)
  }

  const isSelected = useMemo(() : boolean => {
    return props.couple == props.selectedCouple;
  }, [props.couple, props.selectedCouple]);

  return (
    <Flex vertical style={{padding: "8px", backgroundColor: isSelected ? colorInfoBg : "", border: isSelected ? `solid 1px ${colorInfoBorder}` : ""}}>
      <Space>
        <Radio onClick={selectSchedule} checked={isSelected} style={{margin: 0}}/>
        <Text strong={true}>
          {subject?.shortName ?? "undefined"}
        </Text>
        <Tag color={"blue"}>
          {subjectType?.shortName ?? "undefined"}
        </Tag>
      </Space>
      <Space>
        {props.couple.startDate &&
          <Text>
            {props.couple.startDate?.substring(5).split("-").reverse().join(".")}
            {" - "}
            {props.couple.endDate?.substring(5).split("-").reverse().join(".")}
          </Text>
        }
        {props.couple.isRolling &&
            <Tag style={{marginRight: "0px"}}>
                Ч/Т
            </Tag>
        }
        {props.couple.additionalDates.length !== 0 &&
          <Text>
            та [
            {props.couple.additionalDates.map((value) => (value.date.substring(5).split("-").reverse().join("."))).join(", ")}
            ]
          </Text>
        }
        {props.couple.removedDates.length !== 0 &&
          <Text>
            крім [
            {props.couple.removedDates.map((value) => (value.date.substring(5).split("-").reverse().join("."))).join(", ")}
            ]
          </Text>
        }
      </Space>
      <Space>
        <Text>
          {`${teacher?.surname} ${teacher?.name.substring(0, 1)}. ${teacher?.patronymic.substring(0, 1)}.`}
        </Text>
      </Space>
    </Flex>
  );
};

export default ScheduleCard;
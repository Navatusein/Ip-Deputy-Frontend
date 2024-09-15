import {FC, useMemo, useState} from "react";
import {Button, Card, Checkbox, DatePicker, Form, Input, Segmented, Select, Space} from "antd";
import {coupleApi, ICouple} from "@/entities/couple";
import {coupleTimeApi} from "@/entities/couple-time";
import {subjectApi} from "@/entities/subject";
import {subjectTypeApi} from "@/entities/subject-type";
import {studentApi} from "@/entities/student";
import {subgroupApi} from "@/entities/subgroup";
import {teacherApi} from "@/entities/teacher/api/teacher-api.ts";
import {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";
import {DataTable} from "@/widgets/data-table";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {IScheduleForm, IScheduleTable} from "@/pages/schedule";
import ScheduleCard from "../schedule-card/schedule-card.tsx";

const GROUP_NAME = import.meta.env.VITE_GROUP_NAME;

const {RangePicker} = DatePicker;
const {TextArea} = Input;

const SchedulePage: FC = () => {
  const [form] = Form.useForm();

  const [dayOfWeekId, setDayOfWeekId] = useState(1);
  const [selected, setSelected] = useState<ICouple | undefined>();

  const couples = coupleApi.useGetCouplesQuery(dayOfWeekId);
  const coupleTimes = coupleTimeApi.useGetCoupleTimesQuery();
  const subjects = subjectApi.useGetSubjectsQuery();
  const subjectTypes = subjectTypeApi.useGetSubjectTypesQuery();
  const students = studentApi.useGetStudentsQuery();
  const subgroups = subgroupApi.useGetSubgroupsQuery();
  const teachers = teacherApi.useGetTeachersQuery();

  const [create] = coupleApi.useCreateCoupleMutation();
  const [update] = coupleApi.useUpdateCoupleMutation();
  const [remove] = coupleApi.useDeleteCoupleMutation();

  const schedule = useMemo(() => {
    if (!coupleTimes.data || !couples.data)
      return [];

    const schedule: IScheduleTable[] = [];

    coupleTimes.data.forEach((coupleTime) => {
      const timeCouples = couples.data!.filter(x => x.coupleTimeId == coupleTime.id);

      if (!timeCouples || timeCouples.length === 0) {
        return schedule.push({
          id: coupleTime.index + "-" + 1,
          index: coupleTime.index,
          time: coupleTime.timeStart.slice(0, -3) + "-" + coupleTime.timeEnd.slice(0, -3),
          couples: [],
          rowSpan: 1,
          isColSpan: false,
        });
      }

      const scheduleRows: IScheduleTable[] = [];

      timeCouples.forEach((couple, index) => {
        if (!couple.subgroupId) {
          scheduleRows.push({
            id: coupleTime.index + "-" + index,
            index: coupleTime.index,
            time: coupleTime.timeStart.slice(0, -3) + "-" + coupleTime.timeEnd.slice(0, -3),
            couples: [couple],
            rowSpan: 0,
            isColSpan: true,
          });
        }
        else {
          const row = scheduleRows.find(x =>
            x.couples.length != subgroups?.data?.length &&
            x.couples.filter(x => x.subgroupId === couple.subgroupId).length == 0 && !x.isColSpan);

          if (row === undefined) {
            return scheduleRows.push({
              id: coupleTime.index + "-" + index,
              index: coupleTime.index,
              time: coupleTime.timeStart.slice(0, -3) + "-" + coupleTime.timeEnd.slice(0, -3),
              couples: [couple],
              rowSpan: 0,
              isColSpan: false,
            });
          }

          row.couples.push(couple);
        }
      });

      scheduleRows[0].rowSpan = scheduleRows.length;
      schedule.push(...scheduleRows);
    })

    return schedule;
  }, [coupleTimes.data, couples.data, subgroups.data]);

  const columns: ColumnsType<IScheduleTable> = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "25px",
      align: "center",
      rowScope: "row",
      onCell: (record) => {
        return {rowSpan: record.rowSpan};
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "index",
      width: "100px",
      align: "center",
      rowScope: "row",
      ellipsis: true,
      onCell: (record) => {
        return {rowSpan: record.rowSpan};
      },
    },
    {
      title: GROUP_NAME,
      dataIndex: "couples",
      children: subgroups.data?.map((subgroup) => {
        return {
          dataIndex: "couples",
          key: subgroup.id,
          align: "center",
          title: subgroup.name,
          width: `${100 / (subgroups.data?.length ?? 0)}%`,
          onCell: (record) => {
            const params = {style: {padding: "0"}}

            if (record.isColSpan)
              return {...params, colSpan: subgroup.id == subgroups.data?.[0].id ? subgroups.data!.length : 0};

            return params;
          },
          render: (values: ICouple[]) => {
            return values.filter(x => x.subgroupId == subgroup.id || x.subgroupId == null).map((couple, index) => (
              <ScheduleCard key={index} couple={couple} selectedCouple={selected} setSelectedCouple={setSelected}/>
            ));
          },
        }
      })
    }
  ];

  const onUpdate = () => {
    couples.refetch();
    coupleTimes.refetch();
    subjects.refetch();
    subjectTypes.refetch();
    students.refetch();
    subgroups.refetch();
  }

  const onFormSelect = (data: ICouple) => {
    return {
      ...data,
      subgroupId: data.subgroupId == undefined ? -1 : data.subgroupId,
      startEndDateRange: data.startDate == undefined ? undefined : [
        dayjs(data.startDate, "YYYY-MM-DD"),
        dayjs(data.endDate, "YYYY-MM-DD")
      ],
      additionalDates: data.additionalDates.map((scheduleDate) => {
        return {date: dayjs(scheduleDate.date, "YYYY-MM-DD")}
      }),
      removedDates: data.removedDates.map((scheduleDate) => {
        return {date: dayjs(scheduleDate.date, "YYYY-MM-DD")}
      })
    }
  }

  const onFormSubmit = (data: IScheduleForm) => {
    return {
      ...data,
      subgroupId: data.subgroupId === -1 ? undefined : data.subgroupId,
      dayOfWeekId: dayOfWeekId,
      startDate: data.startEndDateRange === undefined ? undefined : dayjs(data.startEndDateRange![0]).format("YYYY-MM-DD").toString(),
      endDate: data.startEndDateRange === undefined ? undefined : dayjs(data.startEndDateRange![1]).format("YYYY-MM-DD").toString(),
      additionalDates: data.additionalDates ? data.additionalDates.map((value) => {
        return {id: 0, date: dayjs(value.date).format("YYYY-MM-DD").toString()}
      }) : [],
      removedDates: data.removedDates ? data.removedDates.map((value) => {
        return {id: 0, date: dayjs(value.date).format("YYYY-MM-DD").toString()}
      }) : [],
    }
  }

  return (
    <Card bordered={false}>
      <Space direction="vertical" style={{width: "100%"}}>
        <Segmented
          options={[
            {label: "Monday", value: 1},
            {label: "Tuesday", value: 2},
            {label: "Wednesday", value: 3},
            {label: "Thursday", value: 4},
            {label: "Friday", value: 5},
            {label: "Saturday", value: 6},
            {label: "Sunday", value: 7}
          ]}
          value={dayOfWeekId}
          onChange={(value) => {setDayOfWeekId(value)}}
        />
        <DataTable
          columns={columns}
          data={schedule}
          isLoading={couples.isLoading}
          onUpdate={onUpdate}
          bordered
          isEditable
          create={async (data: ICouple) => create(data)}
          update={async (data: ICouple) => update(data)}
          remove={async (data: ICouple) => remove(data.id)}
          form={form}
          selectedRow={selected}
          setSelectedRow={setSelected}
          onFormSelect={onFormSelect}
          onFormSubmit={onFormSubmit}
        >
          <Form.Item name="subjectId" label="Subject" rules={[{required: true}]}>
            <Select
              placeholder="Select subject"
              options={subjects?.data?.map((value) => {
                return {value: value.id, label: value.name}
              })}
            />
          </Form.Item>
          <Form.Item name="subjectTypeId" label="Subject Type" rules={[{required: true}]}>
            <Select
              placeholder="Select subject type"
              options={subjectTypes?.data?.map((value) => {
                return {value: value.id, label: value.name}
              })}
            />
          </Form.Item>
          <Form.Item name="coupleTimeId" label="Couple" rules={[{required: true}]}>
            <Select
              placeholder="Select couple"
              options={coupleTimes?.data?.map((value) => {
                return {value: value.id, label: `[${value.index}] ${value.timeStart.slice(0, -3)}-${value.timeEnd.slice(0, -3)}`}
              })}
            />
          </Form.Item>
          <Form.Item name="subgroupId" label="Fow Who" rules={[{required: true}]}>
            <Select
              placeholder="Select for who"
              options={[{value: -1, label: "Whole group"}, ...subgroups?.data?.map((value) => ({value: value.id, label: value.name})) ?? []]}
            />
          </Form.Item>
          <Form.Item name="teacherId" label="Teacher" rules={[{required: true}]}>
            <Select
              placeholder="Select teacher"
              options={teachers?.data?.map((value) => {
                return {value: value.id, label: `${value.surname} ${value.name.substring(0, 1)}. ${value.patronymic.substring(0, 1)}.`}
              })}
            />
          </Form.Item>
          <Form.Item name="cabinet" label="Cabinet">
            <TextArea rows={1}/>
          </Form.Item>
          <Form.Item name="link" label="Link">
            <TextArea rows={1}/>
          </Form.Item>
          <Form.Item name="additionalInformation" label="Additional Info">
            <TextArea rows={1}/>
          </Form.Item>
          <Form.Item name="startEndDateRange" label="Start End Range">
            <RangePicker/>
          </Form.Item>
          <Form.Item name="isRolling" valuePropName="checked">
            <Checkbox>Is Rolling</Checkbox>
          </Form.Item>
          <Form.List name="additionalDates">
            {(fields, {add, remove}) => (
              <>
                <Form.Item>
                  <Button onClick={add} block icon={<PlusOutlined />}>
                    Add additional date
                  </Button>
                </Form.Item>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item {...field} key={field.key + "form"} name={[field.name, "date"]} label={`Additional date ${field.key + 1}`}>
                      <DatePicker/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
          <Form.List name="removedDates">
            {(fields, {add, remove}) => (
              <>
                <Form.Item>
                  <Button onClick={add} block icon={<PlusOutlined/>}>
                    Add removed date
                  </Button>
                </Form.Item>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item {...field} key={field.key + "form"} name={[field.name, "date"]} label={`Removed date ${field.key + 1}`}>
                      <DatePicker/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </DataTable>
      </Space>
    </Card>
  );
};

export default SchedulePage;
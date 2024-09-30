import {FC, useState} from "react";
import {Card, Form, Input, InputNumber} from "antd";
import {ISubgroup, subgroupApi} from "@/entities/subgroup";
import {ColumnsType} from "antd/es/table";
import {DataTable} from "@/widgets/data-table";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const SubgroupInfoPage: FC = () => {
  useSetPageTitle("Subgroup information page");

  const [form] = Form.useForm();

  const [selected, setSelected] = useState<ISubgroup | undefined>();

  const subgroups = subgroupApi.useGetSubgroupsQuery();

  const [create] = subgroupApi.useCreateSubgroupMutation();
  const [update] = subgroupApi.useUpdateSubgroupMutation();
  const [remove] = subgroupApi.useDeleteSubgroupMutation();

  const columns: ColumnsType<ISubgroup> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    }
  ];

  const onUpdate = () => {
    subgroups.refetch();
  };

  return (
    <Card bordered={false}>
      <DataTable
        columns={columns}
        data={subgroups.data}
        isLoading={subgroups.isLoading}
        onUpdate={onUpdate}
        isEditable
        isSelectable
        pagination
        create={async (data: ISubgroup) => create(data)}
        update={async (data: ISubgroup) => update(data)}
        remove={async (data: ISubgroup) => remove(data.id)}
        form={form}
        selectedRow={selected}
        setSelectedRow={setSelected}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="index" label="Index" rules={[{required: true}]}>
          <InputNumber/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default SubgroupInfoPage;
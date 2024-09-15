import {FC, useState} from "react";
import {Checkbox, List} from "antd";
import {CheckboxChangeEvent} from "antd/es/checkbox";

export interface IProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  options?: {label: string; value: number; disabled?: boolean}[];
}

const SelectList: FC<IProps> = (props) => {
  const [values, setValues] = useState<number[]>(props.value ?? []);

  const isSelected = (value: number) => {
    return values.indexOf(value) !== -1;
  }

  const onChange = (event: CheckboxChangeEvent, value: number) => {
    const newValues = event.target.checked ? [...values, value] : values.filter(x => x !== value);

    setValues(newValues);
    props.onChange?.(newValues);
  }

  return (
    <List
      dataSource={props.options}
      bordered
      size={"small"}
      renderItem={(item) => (
        <List.Item style={{padding: 0}}>
          <Checkbox
            style={{width: "100%", padding: "8px 16px"}}
            checked={isSelected(item.value)}
            onChange={(e) => onChange(e, item.value)}
            disabled={item.disabled}
          >
            {item.label}
          </Checkbox>
        </List.Item>
      )}
    />
  );
};

export default SelectList;
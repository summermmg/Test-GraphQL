import { RadioButtonComponent } from "@syncfusion/ej2-react-buttons";

const Grouping = (props) => {
  const { groupOptions, setGroupOptions } = props;

  const onChange = (e) => {
    e.preventDefault();
    const value = e?.target?.value;

    if (value) {
      const temp = { ...groupOptions };
      temp.columns = value === "none" ? [] : [value];
      setGroupOptions(temp);
    }
  };

  return (
    <div className="grouping">
      <RadioButtonComponent
        label="SG"
        name="default"
        value="sg"
        onChange={onChange}
        checked={
          groupOptions.columns.length > 0 && groupOptions.columns[0] === "sg"
        }
      />
      <RadioButtonComponent
        label="LG"
        name="default"
        value="lg"
        onChange={onChange}
        checked={
          groupOptions.columns.length > 0 && groupOptions.columns[0] === "lg"
        }
      />
      <RadioButtonComponent
        label="No Grouping"
        name="default"
        value="none"
        onChange={onChange}
        checked={groupOptions.columns.length === 0}
      />
    </div>
  );
};

export default Grouping;

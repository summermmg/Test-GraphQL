import { nanoid } from "nanoid";
import { CheckBoxComponent, ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { columns } from "./inputList";

const HideColumn = (props) => {
  const { hideColsInfo, setHideColsInfo, onHideColApply } = props;

  const onClick = (e) => {
    const value = e?.target?.value;

    if (value) {
      const temp = new Set(hideColsInfo);
      if (temp.has(value)) {
        temp.delete(value);
      } else {
        temp.add(value);
      }
      setHideColsInfo(temp);
    }
  };

  return (
    <div className="hide-column">
      <div>
      {columns
        .filter((col) => col.isHidable)
        .map((col) => (
          <CheckBoxComponent
            key={nanoid()}
            label={col.field}
            checked={hideColsInfo.has(col.field)}
            value={col.field}
            onClick={onClick}
          />
        ))}
      </div>
      <ButtonComponent className="apply-button" onClick={onHideColApply}>Apply</ButtonComponent>

    </div>
  );
};

export default HideColumn;

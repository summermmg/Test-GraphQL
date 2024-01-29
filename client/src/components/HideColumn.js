import { nanoid } from "nanoid";
import {
  CheckBoxComponent,
  ButtonComponent,
  SwitchComponent,
} from "@syncfusion/ej2-react-buttons";
import { columns } from "./inputList";

const HideColumn = (props) => {
  const {
    hideColsInfo,
    setHideColsInfo,
    withStackedHeader,
    setStackedHeader,
    fetchColumns
  } = props;

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

  const onStackedHeaderChange = (e) => {
    setStackedHeader(e?.checked || false);
  };

  const onHideColApply = () => {
    fetchColumns();
  };

  return (
    <div className="hide-column">
      <div className="check-box-list">
        {columns
          .map((colName) => (
            <CheckBoxComponent
              key={nanoid()}
              label={colName}
              checked={hideColsInfo.has(colName)}
              value={colName}
              onClick={onClick}
            />
          ))}
      </div>

      <div className="buttons">
        <div className="">
          <SwitchComponent
            change={onStackedHeaderChange}
            checked={withStackedHeader}
          />
          <span>Show Stacked Header</span>
        </div>
        <ButtonComponent className="apply-button" onClick={onHideColApply}>
          Apply
        </ButtonComponent>
      </div>
    </div>
  );
};

export default HideColumn;

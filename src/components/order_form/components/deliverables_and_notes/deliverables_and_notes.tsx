import type { ChangeEvent } from "react";
import { useCallback } from "react";
import type { FormData } from "../../constants/constants";
import { DELIVERABLE_OPTIONS } from "../../constants/constants";
import {
  Checkbox,
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface DeliverablesAndNotesProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  role: string;
}

function DeliverablesAndNotes({ formData, onFormDataChange, role }: DeliverablesAndNotesProps) {
  const isExternal = role === "external";

  const handleDeliverablesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isExternal) {
        // Only external users can edit deliverables
        return;
      }

      const { value, checked } = event.target;
      const alreadySelected = formData.requiredDeliverables.includes(value);
      const requiredDeliverables = checked
        ? alreadySelected
          ? formData.requiredDeliverables
          : [...formData.requiredDeliverables, value]
        : formData.requiredDeliverables.filter((item) => item !== value);

      onFormDataChange({ requiredDeliverables });
    },
    [formData.requiredDeliverables, onFormDataChange, isExternal]
  );

  const handleNotesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      onFormDataChange({ notes: value });
    },
    [onFormDataChange]
  );

  const handleClearNotes = useCallback(() => {
    onFormDataChange({ notes: "" });
  }, [onFormDataChange]);

  return (
    <fieldset className="order-form__fieldset">
      <legend className="order-form__legend">Deliverables & Notes</legend>
      
      <FormGroup className="order-form__checkboxes">
        {DELIVERABLE_OPTIONS.map(({ value, label }) => (
          <div 
            key={value} 
            className={`order-form__checkbox ${!isExternal ? 'order-form__checkbox--disabled' : ''}`}
          >
            <Checkbox
              value={value}
              checked={formData.requiredDeliverables.includes(value)}
              onChange={handleDeliverablesChange}
              name="requiredDeliverables"
              disabled={!isExternal}
            />
            <span>{label}</span>
          </div>
        ))}
      </FormGroup>

      <div className="order-form__field order-form__field--span">
        <TextField
          id="notes"
          name="notes"
          label="Notes for the scout"
          value={formData.notes}
          onChange={handleNotesChange}
          placeholder="Add context, safety considerations, or special requests"
          multiline
          minRows={3}
          fullWidth
          disabled={!isExternal}
          slotProps={{
            input: {
              endAdornment: formData.notes && isExternal ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear"
                    edge="end"
                    onClick={handleClearNotes}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </div>
    </fieldset>
  );
}

export default DeliverablesAndNotes;

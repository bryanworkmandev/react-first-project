import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useCallback } from "react";
import { ROLE_OPTIONS } from "../../role_options";
import "./basic_select.scss";

type BasicSelectProps = {
    value: string;
    onChange: (value: string) => void;
};

function BasicSelect({ value, onChange }: BasicSelectProps) {
    const handleChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            onChange(event.target.value as string);
        },
        [onChange]
    );

    return (
        <Box className="basic-select-container">
            <FormControl className="basic-select-container-form-control">
                <InputLabel id="basic-select-role-label">Role</InputLabel>
                <Select
                    labelId="basic-select-role-label"
                    id="basic-select-role-select"
                    label="Role"
                    value={value}
                    onChange={handleChange}
                >
                    {ROLE_OPTIONS.map(({ value: optionValue, label }) => (
                        <MenuItem key={optionValue} value={optionValue}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default BasicSelect;
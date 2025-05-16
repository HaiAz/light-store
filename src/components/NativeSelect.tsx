import { NativeSelect as ChakraNativeSelect } from "@chakra-ui/react"
import React, { forwardRef } from "react"

export type NativeSelectProps<T extends Record<string, unknown>> = ChakraNativeSelect.RootProps & {
  data?: T[]
  selectedValue?: string
  placeholder?: string
  onSelected: (value: T) => void
  nameField: keyof T
  valueField: keyof T
}

// Component implementation
function NativeSelectInner<T extends Record<string, unknown>>(
  {
    placeholder,
    data,
    selectedValue,
    size = "sm",
    onSelected,
    nameField,
    valueField,
    ...rest
  }: NativeSelectProps<T>,
  ref: React.Ref<HTMLInputElement>,
) {
  return (
    <ChakraNativeSelect.Root size={size} ref={ref} {...rest}>
      <ChakraNativeSelect.Field
        placeholder={placeholder}
        value={selectedValue}
        onChange={(e) => {
          const selected = data?.find((item) => String(item[valueField]) === e.currentTarget.value)
          if (selected) {
            onSelected(selected)
          }
        }}
      >
        {data?.map((item, idx) => (
          <option key={idx} value={String(item[valueField])}>
            {String(item[nameField])}
          </option>
        ))}
      </ChakraNativeSelect.Field>
      <ChakraNativeSelect.Indicator />
    </ChakraNativeSelect.Root>
  )
}

// Generic forwardRef — solution
export const NativeSelect = forwardRef(NativeSelectInner) as <T extends Record<string, unknown>>(
  props: NativeSelectProps<T> & { ref?: React.Ref<HTMLInputElement> },
) => ReturnType<typeof NativeSelectInner>

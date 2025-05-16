import { GroupBase, OptionBase, OptionsOrGroups } from 'chakra-react-select';

interface Option extends OptionBase {
  value: string;
  label: string;
}

type OptionList = Array<Option>;

type LoadOptions<TOption> = {
  inputValue: string;
  callback: (options: OptionsOrGroups<TOption, GroupBase<TOption>>) => void;
}

interface GenericOption<T> extends OptionBase {
  label: string;
  value: string;
  obj?: T;
}

function getOptionList<T extends Record<string | 'name' | 'id', unknown>>(optionList: T[] | undefined, labelField: keyof T = 'name', valueField: keyof T | 'id' = 'id'): GenericOption<T>[] {
  if (!optionList) {
    return [];
  }

  return optionList.map((opt): GenericOption<T> => {
    return {
      label: opt[labelField] as string,
      value: opt[valueField] as string,
      obj: opt,
    };
  });
}

function getSelectedOption<T>( optionList: GenericOption<T>[], selectedValue: string): GenericOption<T> | undefined {
  if (!optionList || !selectedValue) {
    return;
  }
  return optionList.find((opt) => opt.value === selectedValue);
}

export { type Option, type OptionList, type LoadOptions, type GenericOption, getOptionList, getSelectedOption };

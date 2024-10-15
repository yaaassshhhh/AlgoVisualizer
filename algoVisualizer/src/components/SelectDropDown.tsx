
const SelectDropDown = (
    {
        value , 
        onChange,
        children,
        label,
    } : {
        value : number;
        onChange : (value : React.ChangeEvent<HTMLSelectElement>) => void;
        children : React.ReactNode;
        label : string;
    }
) => {
  return (
    <label className=" cursor-pointer group transition flex items-center justify-center ease-in bg-gray-700 h-8 hover:bg-gray-800 rounded-full px-2 shadow-md disbaled:opacity-50 ">
        <select
        className="bg-gray-700 cursor-pointer group-hover:bg-gray-800 transition ease-in text-white "
        aria-label={label}
        value={value}
        onChange={onChange}
        >
            {children}
        </select>
    </label>
  )
}

export default SelectDropDown
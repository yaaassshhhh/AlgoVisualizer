

const Button = ({onClick , children} : {onClick : () => void ; children : React.ReactNode;}) => {
  return (
    <button
    onClick={onClick}
    className="transition ease-in flex items-center justify-center h-8 px-4 rounded-full shadow-md bg-gray-700 hover:bg-gray-800 text-white"
    >
        {children}
    </button>
  )
}

export default Button
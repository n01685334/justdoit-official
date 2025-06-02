interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  required,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

interface ButtonProps {
  type?: "submit" | "button";
  label: string
}

export function Button({ label }: ButtonProps) {
  return (
    <button
      type="submit"
      className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      {label}
    </button>
  )
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <form className="space-y-6">
        {children}
      </form>
    </div>
  );
}
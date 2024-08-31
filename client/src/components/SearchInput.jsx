import { SearchIcon } from "@heroicons/react/solid";

export default function SearchInput(props) {
  return (
    <div className="flex w-[50%] h-10 border hover:border-gray-400 border-gray-300 rounded-3xl overflow-hidden">
      <a
        href="#"
        aria-label="Search"
        className="flex justify-center w-10 h-full bg-gray-200 border-r border-gray-300"
      >
        <SearchIcon width={20} className="text-gray-400" />
      </a>
      <input
        type="text"
        placeholder={props.placeholder}
        className="flex-grow h-full px-4 border-none outline-none focus:ring-1
             focus:ring-blue-500"
      />
    </div>
  );
}

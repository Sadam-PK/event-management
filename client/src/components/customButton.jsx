export default function CustomButton(props){
    return (
    <button className="bg-red-300 p-2 border rounded-lg">
        {props.name}
    </button>
    )
}
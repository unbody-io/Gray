
type Props = {
    label: string;
    size: number;
}
const DefaultsSearchResultsListHeader = ({size, label}: Props) => (
  <div className={"pb-4 text-gray-500 capitalize text-sm"}>
      <h4>Found {size} related {label}{size>1?"s":""}</h4>
  </div>
);


export default DefaultsSearchResultsListHeader;

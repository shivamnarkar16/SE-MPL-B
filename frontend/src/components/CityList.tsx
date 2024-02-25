interface CityListProps {
  city: string;
}
const CityList = ({ city }: CityListProps) => {
  return <div>{city}</div>;
};

export default CityList;

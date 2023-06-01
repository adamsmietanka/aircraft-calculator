import WeightComponent from "./weightComponent";

export default interface WeightConfiguration {
  name: string;
  components: WeightComponent[];
  MAC: number;
  MACPosition: number;
}

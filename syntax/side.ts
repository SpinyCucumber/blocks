import { directions } from "../utility";

/**
 * Each side corresponds to one of the four cardinal directions.
 * Sides support getting the associated direction and finding the opposite side.
 */
 export type Side = number;

 export function getDirection(side: Side) {
     return directions.get(side);
 }
 
 export function getOpposite(side: Side): Side {
     return (side + 2) % 4;
 }
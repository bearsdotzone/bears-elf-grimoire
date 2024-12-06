import { Task } from "grimoire-kolmafia";
import { availableAmount, getProperty, Item, runChoice, setProperty, use } from "kolmafia";
import { info } from "libram/dist/console";
import { args, effectTranspondent, propertyGrimaceChoice, mapToGrimace } from "../main";

const distentionPill = Item.get(5168);
const syntheticDogHairPill = Item.get(5167);

export const TaskGetPills: Task = {
  name: "TaskGetPills",
  completed: () => {
    if (
      availableAmount(syntheticDogHairPill) > args.pillsqty &&
      availableAmount(distentionPill) > args.pillsqty
    ) {
      info(`More pills than anybody could use.`);
      return true;
    }
    if (availableAmount(mapToGrimace) === 0) {
      return true;
    }
    return false;
  },
  do: () => {
    const checkpointChoice = getProperty(propertyGrimaceChoice);
    if (availableAmount(syntheticDogHairPill) > availableAmount(distentionPill)) {
      // Get distention pill
      setProperty(propertyGrimaceChoice, "1");
      use(mapToGrimace, 1);
      runChoice(-1);
    } else {
      // Get dog hair pill
      setProperty(propertyGrimaceChoice, "2");
      use(mapToGrimace, 1);
      runChoice(-1);
    }
    setProperty(propertyGrimaceChoice, checkpointChoice);
  },
  // acquire: [{ item: mapToGrimace }],
  // effects: [effectTranspondent],
};

// export const TaskDistention: Task = {
//   ...TaskGetPills,
//   do: () => {
//     return false;
//   }
// }

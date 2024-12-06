import { Args, Engine, getTasks } from "grimoire-kolmafia";
import { Effect, Item } from "kolmafia";
import { TaskGetPills } from "./tasks/TaskGetPills";
import { QuestElves } from "./quests/QuestElves";

export const mapToGrimace = Item.get(5172);
export const mapToRonald = Item.get(5171);

export const propertyGrimaceChoice = `choiceAdventure536`;
export const propertyRonaldChoice = `choiceAdventure535`;

export const itemTransporter = Item.get(5170);
export const effectTranspondent = Effect.get(846);

export const args = Args.create(
  "bears-elf-grimoire",
  "A script to complete the Repair the Elves' Shield Generator quest or optionally gather synthetic dog hair pills and distention pills in equal amounts.",
  {
    pills: Args.flag({
      key: "pills",
      help: `Running the script with this flag attempts to use all available grimace maps for an even amount of synthetic dog hair and distention pills`,
    }),
    pillsqty: Args.number({
      key: "pillsqty",
      help: `Maximum quantity of pills to have`,
      default: 100,
    }),
  }
);

export function main(command?: string): void {
  Args.fill(args, command);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  if (args.pills) {
    // We want pills from our maps.
    const engine = new Engine([TaskGetPills]);
    engine.run();
    engine.destruct();
    return;
  }

  const engine = new Engine(getTasks([QuestElves]));
  engine.run();
  engine.destruct();
}

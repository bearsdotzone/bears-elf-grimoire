import { Quest, step, Task } from "grimoire-kolmafia";
import { availableAmount, haveEffect, Item, Location, runChoice, use } from "kolmafia";
import {
  effectTranspondent,
  mapToGrimace as itemGrimaceMap,
  mapToRonald as itemRonaldMap,
  itemTransporter,
} from "../main";

const propertyElfQuest = `questF04Elves`;

const itemEMUHarness = Item.get(5138);
const itemEMUHelmet = Item.get(5137);
const itemEMUJoystick = Item.get(5135);
const itemEMUThrusters = Item.get(5136);

const itemEMUUnit = Item.get(5143);
const itemSpookyLittleGirl = Item.get(5165);

const locationGrimace = Location.get(266);
const locationHamburglaris = Location.get(267);
const locationRonald = Location.get(265);

const taskGetTranspondent: Task = {
  name: "taskGetTranspondent",
  completed: () => haveEffect(effectTranspondent) > 0,
  do: () => use(itemTransporter),
};

const taskGetGrimaceMaps: Task = {
  name: "taskGetGrimaceMaps",
  completed: () =>
    availableAmount(itemGrimaceMap) === 2 ||
    [
      itemEMUHarness,
      itemEMUHelmet,
      itemEMUJoystick,
      itemEMUThrusters,
      itemEMUUnit,
      itemSpookyLittleGirl,
    ].some((item) => availableAmount(item) > 0),
  do: locationGrimace,
  // effects: [effectTranspondent],
  outfit: {
    modifier: `item drop`,
  },
};

const taskGetRonaldMaps: Task = {
  name: "taskGetRonaldMaps",
  completed: () =>
    availableAmount(itemRonaldMap) === 2 ||
    [
      itemEMUHarness,
      itemEMUHelmet,
      itemEMUJoystick,
      itemEMUThrusters,
      itemEMUUnit,
      itemSpookyLittleGirl,
    ].some((item) => availableAmount(item) > 0),
  do: locationRonald,
  // effects: [effectTranspondent],
  outfit: {
    modifier: `item drop`,
  },
};

function hasEmuGirlOrComponent(component: Item) {
  return [itemEMUUnit, itemSpookyLittleGirl, component].some((item) => availableAmount(item) > 0);
}

// Goal for the EMU thrusters is 1
const taskEMUThrusters: Task = {
  name: "taskEMUThrusters",
  completed: () => hasEmuGirlOrComponent(itemEMUThrusters),
  do: () => {
    use(itemRonaldMap, 1);
    runChoice(-1);
  },
  // acquire: [{ item: itemRonaldMap }],
  // effects: [effectTranspondent],
  choices: { 535: 1 },
};

// Goal for the EMU joystick is 3
const taskEMUJoystick: Task = {
  name: "taskEMUJoystick",
  completed: () => hasEmuGirlOrComponent(itemEMUJoystick),
  do: () => {
    use(itemRonaldMap, 1);
    runChoice(-1);
  },
  // acquire: [{ item: itemRonaldMap }],
  // effects: [effectTranspondent],
  choices: { 535: 3 },
};

// Goal for the EMU harness is 4
const taskEMUHarness: Task = {
  name: "taskEMUHarness",
  completed: () => hasEmuGirlOrComponent(itemEMUHarness),
  do: () => {
    use(itemGrimaceMap, 1);
    runChoice(-1);
  },
  // acquire: [{ item: itemGrimaceMap }],
  // effects: [effectTranspondent],
  choices: { 536: 4 },
};

// Goal for the EMU helmet is 6
const taskEMUHelmet: Task = {
  name: "taskEMUHelmet",
  completed: () => hasEmuGirlOrComponent(itemEMUHelmet),
  do: () => {
    use(itemGrimaceMap, 1);
    runChoice(-1);
  },
  // acquire: [{ item: itemGrimaceMap }],
  // effects: [effectTranspondent],
  choices: { 536: 6 },
};

const taskGetLittleGirl: Task = {
  name: "taskGetLittleGirl",
  after: [`taskEMUThrusters`, `taskEMUJoystick`, `taskEMUHarness`, `taskEMUHelmet`],
  completed: () => availableAmount(itemSpookyLittleGirl) > 0 || availableAmount(itemEMUUnit) > 0,
  do: locationGrimace,
};

const taskLittleGirl: Task = {
  name: "taskLittleGirl",
  after: [`taskGetLittleGirl`],
  completed: () => availableAmount(itemEMUUnit) > 0,
  do: locationGrimace,
  // effects: [effectTranspondent],
  // TODO: This only works for one tapping.
  outfit: {
    equip: [itemSpookyLittleGirl],
    modifier: `initiative`,
  },
};

const taskHamburglaris: Task = {
  name: "taskHamburglaris",
  after: [`taskLittleGirl`],
  completed: () => step(propertyElfQuest) === 999,
  do: locationHamburglaris,
  // effects: [effectTranspondent],
  outfit: {
    equip: [itemEMUUnit],
  },
};

export const QuestElves: Quest<Task> = {
  name: "QuestElves",
  completed: () => step(propertyElfQuest) === 999,
  tasks: [
    taskGetTranspondent,
    taskGetRonaldMaps,
    taskGetGrimaceMaps,
    taskEMUThrusters,
    taskEMUJoystick,
    taskEMUHarness,
    taskEMUHelmet,
    taskGetLittleGirl,
    taskLittleGirl,
    taskHamburglaris,
  ],
};

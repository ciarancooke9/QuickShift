import { Timestamp } from "@firebase/firestore";

const separateOldObjects = (objects) => {
  const now = Timestamp.fromDate(new Date());
  const oldObjects = [];
  const newObjects = [];

  objects.forEach((obj) => {
    const { timeServer } = obj;
    const timeDiff = now.toMillis() - timeServer.toMillis();
    const isOld = timeDiff >= 24 * 60 * 60 * 1000;
    if (isOld) {
      oldObjects.push(obj);
    } else {
      newObjects.push(obj);
    }
  });

  return { oldObjects, newObjects };
};

export default separateOldObjects;

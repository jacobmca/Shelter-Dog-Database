export const getSavedDogIds = () => {
  const savedDogIds = localStorage.getItem("saved_dogs");
  return savedDogIds ? JSON.parse(savedDogIds) : [];
};

export const saveDogIds = (dogIdArr: string[]): void => {
  if (dogIdArr.length) {
    localStorage.setItem("saved_dogs", JSON.stringify(dogIdArr));
  } else {
    localStorage.removeItem("saved_dog");
  }
};

export const removeDogId = (dogId: string) => {
  const savedDogIds = localStorage.getItem("saved_dogs");
  const parsedDogIds: string[] = savedDogIds ? JSON.parse(savedDogIds) : null;

  if (!parsedDogIds) {
    return false;
  }

  const updatedSavedDogIds = parsedDogIds.filter(
    (savedDogId: string) => savedDogId !== dogId
  );
  localStorage.setItem("saved_dogs", JSON.stringify(updatedSavedDogIds));

  return true;
};

export const createUUID = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    console.error(e, "Faild to create UUID");
    return null;
  }
}
// import { RsetShowLoading } from "../../hook/slices/main";
// import { store } from "../../hook/store/index";

const asyncWrapper = (fn) => {
  return (...args) => {
    return fn(...args).catch((error) => {
      //   store.dispatch(RsetShowLoading({ value: false }));
      console.log("HHHHHHHHHHHHHHHElo wrapper");
      console.error(error);
      throw error;
    });
  };
};

export default asyncWrapper;

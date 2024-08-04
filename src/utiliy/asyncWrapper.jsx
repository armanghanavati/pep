// import { RsetShowLoading } from "../../hook/slices/main";
import { RsetShowToast } from "../redux/reducers/main/main-slice";
import store from "../redux/reducers/store";

const asyncWrapper = (fn) => {
  return (...args) => {
    return fn(...args).catch((error) => {
      //   store.dispatch(RsetShowLoading({ value: false }));
      console.log("HHHHHHHHHHHHHHHElo wrapper", error);
      store.dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: "مشکلی در سرور به وجود آمده است",
          Type: "Unsuccess",
        })
      );
      console.error(error);
      throw error;
    });
  };
};

export default asyncWrapper;

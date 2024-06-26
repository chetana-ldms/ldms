import loadingImage from "./Images/logo_small.png";
const UsersListLoading = () => {
  const styles = {
    // borderRadius: '0.475rem',
    // boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
    backgroundColor: '#fff',
    color: '#008cba',
    fontWeight: '500',
    margin: '0',
    width: 'auto',
    padding: '1rem 2rem',
    top: 'calc(50% - 2rem)',
    left: 'calc(50% - 4rem)',
    zIndex: '1',
  }

  return <>
      <div style={{...styles, position: 'absolute', textAlign: 'center'}}><img width="30" alt='Loading' src={loadingImage} className="block mg-left-10"  style={{padding: '0'}}/> Processing...</div></>
}

export {UsersListLoading}

// import React from "react";
// import loadingImage from "./Images/loading.gif";
// import "./UserListLoading.css"

// const UsersListLoading = () => {
//   const styles = {
//     borderRadius: "0.475rem",
//     boxShadow: "0 0 50px 0 rgb(82 63 105 / 15%)",
//     backgroundColor: "#fff",
//     color: "#008cba",
//     fontWeight: "500",
//     margin: "0",
//     width: "auto",
//     padding: "1rem 2rem",
//     top: "90%",
//     left: "calc(50% - 4rem)",
//     position: "absolute",
//     textAlign: "center",
//   };

//   return (
//     <div className="text-center loading">
//     <img alt='Loading' src={loadingImage}/>
//     </div>
//   );
// };

// export { UsersListLoading };

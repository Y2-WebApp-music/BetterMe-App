// /* eslint-disable react-hooks/exhaustive-deps */
// import { CheckToken } from "@/api/auth.api";
// import { useAuth } from "@/context/auth.context";
// import {
//   IUserAuthContext,
//   IUserDetail,
// } from "@/interface/userdetail.interface";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { usePathname, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import LoadingBubble from "./Loading";

// type Props = {
//   children: React.ReactNode;
// };

// const ProtectedLogin: React.FC<Props> = ({ children }) => {
//   const auth = useAuth();
//   const [appIsReady, setAppIsReady] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const prepareApp = async () => {
//       try {
//         const token = await AsyncStorage.getItem("accessToken");

//         if (!token) {
//           throw new Error("Token not found");
//         }

//         const result: IUserDetail | null = await CheckToken(token).catch(
//           (error) => {
//             console.error(error);
//             return null;
//           }
//         );

//         if (!result) {
//           throw new Error("Token is invalid");
//         }

//         const userData: IUserAuthContext = {
//           isAuth: true,
//           user_id: result.user_id,
//           email: result.email,
//           name: result.name,
//           role: result.role,
//           surname: result.surname,
//           phone: result.phone,
//           profile_image_url: result.profile_image_url,
//         };

//         auth?.setAuthContext(userData);
//       } catch {
//         auth?.setAuthContext({
//           isAuth: false,
//           user_id: "",
//           email: "",
//           name: "",
//           role: "",
//           surname: "",
//           phone: "",
//           profile_image_url: "",
//         });
//       } finally {
//         setAppIsReady(true);
//       }
//     };

//     prepareApp();
//   }, [auth?.authContext.isAuth, usePathname()]);

//   useEffect(() => {
//     if (appIsReady && !auth?.authContext.isAuth) {
//       const timeoutId = setTimeout(() => {
//         router.replace("/loginpage");
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     } else {
//       const timeoutId = setTimeout(() => {
//         router.replace("/(tabs)/home");
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [appIsReady, auth?.authContext.isAuth, router]);

//   if (!appIsReady) {
//     return <LoadingBubble />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedLogin;

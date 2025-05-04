import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface VerifySessionResponse {
  status: string;
  role?: string;
  redirectTo?: string;
  message?: string;
}

export const getHouses = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    console.log(
      "[gH] Function called. App Check:",
      !!request.app,
      "Auth:",
      !!request.auth
    );
    if (request.auth) {
      console.log(
        "[getHouses] ID:",
        request.auth.uid,
        "Role:",
        request.auth.token.role
      );
    }
    if (!request.app) {
      console.log("[getHouses] Missing App Check token.");
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth) {
      console.log("[getHouses] Non-authenticated request: unauthorized.");
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    try {
      let snapshot;
      const userRole = request.auth.token.role;
      if (userRole === "admin") {
        console.log("[gH] Admin request: fetching all non-public houses.");
        snapshot = await admin.firestore().collection("houses").get();
        console.log(
          "[gH] Fetched",
          snapshot.size,
          "non-public houses (admin)."
        );
      } else {
        console.log(
          "[getHouses] Authenticated non-admin request:",
          request.auth.uid
        );
        snapshot = await admin
          .firestore()
          .collection("houses")
          .where("isPublic", "==", false)
          .where("allowedUsers", "array-contains", request.auth.uid)
          .get();
        console.log(
          "[gH] Fetched",
          snapshot.size,
          "private houses for UID:",
          request.auth.uid
        );
      }

      const houses = snapshot.docs.map((doc) => {
        // remove any stray `id` field in the stored data
        const data = {...(doc.data() as Record<string, any>)};
        // spread the rest, then attach the real doc.id
        return {...data, id: doc.id};
      });

      console.log("[getHouses] Returning", houses.length, "houses.");
      return houses;
    } catch (error) {
      console.error("[getHouses] Error:", error);
      if (error instanceof Error) console.error(error.stack);
      throw new functions.https.HttpsError(
        "internal",
        "Internal server error."
      );
    }
  }
);

export const verifySession = functions.https.onCall(
  async (request: functions.https
    .CallableRequest): Promise<VerifySessionResponse> => {
    console.log("verifySession: Received request with data:", request.data);

    const sessionCookie = request.data.sessionCookie;
    if (!sessionCookie) {
      console.log(
        "verifySession: No sessionCookie provided; returning unauthenticated."
      );
      return {status: "unauthenticated", redirectTo: "/login"};
    }

    console.log(
      "verifySession: Received session cookie:",
      sessionCookie.substring(0, 20) + "..."
    );

    try {
      const decodedClaims = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
      console.log("verifySession: Decoded claims:", decodedClaims);

      const userRole = decodedClaims.role;
      if (!userRole || userRole !== "admin") {
        console.log("verifySession: User unauthorized, role:", userRole);
        return {status: "unauthorized", redirectTo: "/unauthorized"};
      }

      console.log("verifySession: User authorized with role:", userRole);
      return {status: "authorized", role: userRole};
    } catch (error) {
      console.error("verifySession: Error verifying session cookie:", error);
      return {
        status: "error",
        redirectTo: "/login",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);

export const addHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can add houses."
      );
    }
    try {
      // strip out any incoming `id` so we never persist it
      const {id, ...houseData} = request.data as Record<string, any>;
      const docRef = await admin
        .firestore()
        .collection("houses")
        .add(houseData);
      return {id: docRef.id};
    } catch (error) {
      console.error("Error adding house:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to add house."
      );
    }
  }
);

export const updateHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can update houses."
      );
    }
    try {
      const {id, ...houseData} = request.data as Record<string, any>;
      await admin.firestore().collection("houses").doc(id).update(houseData);
      return {success: true};
    } catch (error) {
      console.error("Error updating house:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to update house."
      );
    }
  }
);

export const deleteHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can delete houses."
      );
    }
    try {
      const {id} = request.data as { id: string };
      await admin.firestore().collection("houses").doc(id).delete();
      return {success: true};
    } catch (error) {
      console.error("Error deleting house:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to delete house."
      );
    }
  }
);

export const getUsers = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    console.log(
      "[getUsers] Function called. App Check:",
      !!request.app,
      "Auth:",
      !!request.auth
    );
    if (request.auth) {
      console.log(
        "[getUsers] User UID:",
        request.auth.uid,
        "Role:",
        request.auth.token.role
      );
    }
    if (!request.app) {
      console.log("[getUsers] Missing App Check token.");
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      console.log("[getUsers] Unauthorized request: not an admin.");
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can access user list."
      );
    }
    try {
      console.log("[getUsers] Fetching user list for admin.");
      const listUsersResult = await admin.auth().listUsers();
      const users = listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
      }));
      console.log("[getUsers] Fetched", users.length, "users.");
      return {users};
    } catch (error) {
      console.error("[getUsers] Error:", error);
      if (error instanceof Error) console.error(error.stack);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to fetch users."
      );
    }
  }
);

export const addAllowedUser = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can modify allowed users."
      );
    }
    const {houseId, uid} = request.data as { houseId: string; uid: string };
    await admin
      .firestore()
      .collection("houses")
      .doc(houseId)
      .update({
        allowedUsers: admin.firestore.FieldValue.arrayUnion(uid),
      });
    return {success: true};
  }
);

export const removeAllowedUser = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Missing App Check token."
      );
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can modify allowed users."
      );
    }
    const {houseId, uid} = request.data as { houseId: string; uid: string };
    await admin
      .firestore()
      .collection("houses")
      .doc(houseId)
      .update({
        allowedUsers: admin.firestore.FieldValue.arrayRemove(uid),
      });
    return {success: true};
  }
);
